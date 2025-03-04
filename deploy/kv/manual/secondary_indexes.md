---
title: "二级索引"
oldUrl:
  - /runtime/manual/runtime/kv/secondary_indexes
  - /kv/manual/secondary_indexes
---

<deno-admonition></deno-admonition>

像 Deno KV
这样的键值存储将数据组织为键值对的集合，其中每个唯一的键都与一个值相关联。这种结构使得基于键的值检索变得容易，但不允许基于值本身进行查询。为了克服这一限制，可以创建二级索引，它将相同的值存储在包含（部分）该值的附加键下。

在使用二级索引时，保持主键和二级键之间的一致性至关重要。如果在主键处更新了值而未更新二级键，则针对二级键的查询返回的数据将不正确。为了确保主键和二级键始终表示相同的数据，在插入、更新或删除数据时使用原子操作。这种方法确保一组变异操作作为一个单元执行，要么全部成功，要么全部失败，从而防止不一致。

## 唯一索引（一对一）

唯一索引中的每个键都与一个主键相关联。例如，在存储用户数据并通过其唯一 ID
和电子邮件地址查找用户时，将用户数据存储在两个单独的键下：一个用于主键（用户
ID），另一个用于二级索引（电子邮件）。这种设置允许基于 ID
或电子邮件查询用户。二级索引还可以对存储中的值强制执行唯一性约束。在用户数据的情况下，使用索引确保每个电子邮件地址仅与一个用户相关联——换句话说，电子邮件是唯一的。

要为这个示例实现唯一的二级索引，请按照以下步骤操作：

1. 创建一个表示数据的 `User` 接口：

   ```ts
   interface User {
     id: string;
     name: string;
     email: string;
   }
   ```

2. 定义一个 `insertUser` 函数，将用户数据存储在主键和二级键下：

   ```ts
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byEmailKey = ["users_by_email", user.email];
     const res = await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .check({ key: byEmailKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byEmailKey, user)
       .commit();
     if (!res.ok) {
       throw new TypeError("User with ID or email already exists");
     }
   }
   ```

   > 此函数使用原子操作执行插入，检查是否已存在具有相同 ID
   > 或电子邮件的用户。如果违反了这些约束中的任何一个，插入将失败，并且不会修改任何数据。

3. 定义一个 `getUser` 函数，通过 ID 检索用户：

   ```ts
   async function getUser(id: string): Promise<User | null> {
     const res = await kv.get<User>(["users", id]);
     return res.value;
   }
   ```

4. 定义一个 `getUserByEmail` 函数，通过电子邮件地址检索用户：

   ```ts
   async function getUserByEmail(email: string): Promise<User | null> {
     const res = await kv.get<User>(["users_by_email", email]);
     return res.value;
   }
   ```

   此函数使用二级键（`["users_by_email", email]`）查询存储。

5. 定义一个 `deleteUser` 函数，通过 ID 删除用户：

   ```ts
   async function deleteUser(id: string) {
     let res = { ok: false };
     while (!res.ok) {
       const getRes = await kv.get<User>(["users", id]);
       if (getRes.value === null) return;
       res = await kv.atomic()
         .check(getRes)
         .delete(["users", id])
         .delete(["users_by_email", getRes.value.email])
         .commit();
     }
   }
   ```

   > 此函数首先通过 ID
   > 检索用户以获取用户的电子邮件地址。这是为了获取构建该用户地址的二级索引键所需的电子邮件。然后，它执行一个原子操作，检查数据库中的用户是否未更改，然后删除指向用户值的主键和二级键。如果失败（用户在查询和删除之间已被修改），原子操作将中止。整个过程将重试，直到删除成功。需要检查以防止在检索和删除之间值可能已被修改的竞争条件。如果更新更改了用户的电子邮件，则可能会发生这种竞争，因为在这种情况下二级索引会移动。然后，二级索引的删除将失败，因为删除的目标是旧的二级索引键。

## 非唯一索引（一对多）

非唯一索引是二级索引，其中单个键可以与多个主键相关联，允许基于共享属性查询多个项目。例如，在通过用户最喜欢的颜色查询用户时，使用非唯一二级索引实现此功能。最喜欢的颜色是非唯一属性，因为多个用户可以有相同的最喜欢的颜色。

要为这个示例实现非唯一二级索引，请按照以下步骤操作：

1. 定义 `User` 接口：

   ```ts
   interface User {
     id: string;
     name: string;
     favoriteColor: string;
   }
   ```

2. 定义 `insertUser` 函数：

   ```ts
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byColorKey = [
       "users_by_favorite_color",
       user.favoriteColor,
       user.id,
     ];
     await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byColorKey, user)
       .commit();
   }
   ```

3. 定义一个函数，通过最喜欢的颜色检索用户：

   ```ts
   async function getUsersByFavoriteColor(color: string): Promise<User[]> {
     const iter = kv.list<User>({ prefix: ["users_by_favorite_color", color] });
     const users = [];
     for await (const { value } of iter) {
       users.push(value);
     }
     return users;
   }
   ```

此示例演示了非唯一二级索引 `users_by_favorite_color`
的使用，它允许基于用户最喜欢的颜色查询用户。主键仍然是用户 `id`。

唯一索引和非唯一索引的实现之间的主要区别在于二级键的结构和组织。在唯一索引中，每个二级键与一个主键相关联，确保索引属性在所有记录中是唯一的。在非唯一索引的情况下，单个二级键可以与多个主键相关联，因为索引属性可能在多个记录之间共享。为了实现这一点，非唯一二级键通常以附加的唯一标识符（例如主键）作为键的一部分进行结构化，从而允许多个具有相同属性的记录共存而不会发生冲突。
