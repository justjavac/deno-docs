import OpenApiEndpoint from "@site/src/components/OpenApiEndpoint";

# 组织

组织是项目、域和 KV 数据库的容器。可以在
[Deno Deploy 仪表板](https://dash.deno.com) 中创建新的组织。为
您的帐户创建的访问令牌可能对您可以访问的任何组织进行更改。

## 获取组织详细信息

<OpenApiEndpoint path="/organizations/{organizationId}" method="get">
  通过将您的唯一 ID 作为路径参数传递，获取有关您的组织的元信息。
</OpenApiEndpoint>

## 获取组织的分析信息

<OpenApiEndpoint path="/organizations/{organizationId}/analytics" method="get">
  获取组织的分析信息。
</OpenApiEndpoint>

## 列出组织的项目

<OpenApiEndpoint path="/organizations/{organizationId}/projects" method="get">
  获取一个组织的项目的分页列表。结果的第一页、最后一页、下一页和上一页的链接
  在响应的 <code>Link</code> &nbsp; 头部中找到。
</OpenApiEndpoint>

## 为组织创建新项目

<OpenApiEndpoint path="/organizations/{organizationId}/projects" method="post">
  在给定组织内创建一个新项目。项目是部署的容器，并且可以与域和 KV 数据库关联。
</OpenApiEndpoint>

## 列出组织的 KV 数据库

<OpenApiEndpoint path="/organizations/{organizationId}/databases" method="get">
  获取与组织关联的 KV 数据库列表。结果的第一页、最后一页、下一页和上一页的链接
  在响应的 <code>Link</code> &nbsp; 头部中找到。
</OpenApiEndpoint>

## 为组织创建 KV 数据库

<OpenApiEndpoint path="/organizations/{organizationId}/databases" method="post">
  创建与组织关联的新 KV 数据库。
</OpenApiEndpoint>

## 列出组织的域

<OpenApiEndpoint path="/organizations/{organizationId}/domains" method="get">
  获取与组织关联的域列表。结果的第一页、最后一页、下一页和上一页的链接
  在响应的 <code>Link</code> &nbsp; 头部中找到。
</OpenApiEndpoint>

## 将域添加到组织

<OpenApiEndpoint path="/organizations/{organizationId}/domains" method="post">
  将新域添加到指定的组织。在使用之前，添加的域
  需要进行验证，并且需要为域提供 TLS 证书。
</OpenApiEndpoint>
