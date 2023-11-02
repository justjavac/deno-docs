# 自定义域名

默认情况下，项目可以通过其预览 URL 访问，即 `$PROJECT_ID.deno.dev`，例如
`dead-clam-55.deno.dev`。您还可以按照以下说明添加自定义域名。

## **步骤 1：** 在 Deno Deploy 仪表板中添加您的自定义域名

1. 单击项目页面上的 "设置" 按钮，然后从侧边栏中选择 "域名"。
2. 输入您希望添加到项目的域名，然后单击
   "添加"。请注意，您必须拥有您要添加到项目的域名。如果您还没有拥有域名，可以在像
   Google Domains、Namecheap 或 gandi.net 这样的域名注册商处注册一个域名。
   ![add_custom_domain](../docs-images/add_custom_domain.png)

3. 该域名将添加到域名列表中，并将显示 "设置" 徽章。
4. 单击 "设置" 徽章以访问域名设置页面，该页面将显示需要为您的域名创建/更新的 DNS
   记录列表。 ![dns_records_modal](../docs-images/dns_records_modal.png)

## **步骤 2：** 更新您的自定义域名的 DNS 记录

转到您的域名注册商（或用于管理 DNS 的服务）的 DNS
配置面板，并按照域名设置页面上描述的方式输入记录。

![change_dns_records](../docs-images/change_dns_records.png)

## **步骤 3：** 验证 DNS 记录是否已更新

返回到 Deno Deploy 仪表板，然后单击域名设置页面上的 **验证** 按钮。它将检查 DNS
记录是否正确设置，如果是，则将状态更新为 "已验证，等待证书提供"。

![get_certificates](../docs-images/get_certificates.png)

## **步骤 4：** 为您的自定义域名提供证书

此时您有两个选项。99% 的情况下，您应该选择第一个选项。

1. 让我们使用 Let's Encrypt 自动提供证书。

   要执行此操作，请单击 **获取自动证书** 按钮。提供 TLS
   证书可能需要一分钟的时间。如果您的域名指定了阻止
   [Let's Encrypt](https://letsencrypt.org/) 提供证书的 CAA
   记录，那么提供可能会失败。证书将在证书到期前约 30
   天自动续订。当成功颁发证书后，您将看到一个绿色的复选标志，如下所示：

   ![green_check](../docs-images/green_check.png)

2. 手动上传证书和私钥。

   要手动上传证书链和私钥，请单击 **上传您自己的证书**
   按钮。您将被提示上传一个完整且有效的证书链，以及您的根证书需要位于链的顶部。
