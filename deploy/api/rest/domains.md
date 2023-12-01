import OpenApiEndpoint from "@site/src/components/OpenApiEndpoint";

# 域名

自定义域名可用于为您的部署提供独特的 URL。

## 列出组织的域名

<OpenApiEndpoint path="/organizations/{organizationId}/domains" method="get">
  获取与组织关联的域名列表。在响应的 <code>Link</code> 头中找到到第一页、最后一页、下一页和上一页结果的链接。
</OpenApiEndpoint>

## 向组织添加域名

<OpenApiEndpoint path="/organizations/{organizationId}/domains" method="post">
  向指定组织添加新域名。在使用之前，添加的域名需要经过验证，并且需要为该域名提供 TLS 证书。
</OpenApiEndpoint>

## 根据ID获取域名

<OpenApiEndpoint path="/domains/{domainId}" method="get">
  根据给定的ID获取有关域名的元数据。
</OpenApiEndpoint>

## 将域名与部署关联

<OpenApiEndpoint path="/domains/{domainId}" method="patch">
  使用此 API 端点，您可以将域名与部署关联或取消关联。为了在域上提供部署，需要域名关联。
</OpenApiEndpoint>

## 删除域名

<OpenApiEndpoint path="/domains/{domainId}" method="delete">
  根据给定的ID删除域名。
</OpenApiEndpoint>

## 验证域名

<OpenApiEndpoint path="/domains/{domainId}/verify" method="post">
  此 API 端点触发域名的所有权验证。在必要的 DNS 记录正确设置后调用此端点。
</OpenApiEndpoint>

## 为域名上传 TLS 证书

<OpenApiEndpoint path="/domains/{domainId}/certificates" method="post">
  为您的域名上传 TLS 证书。
</OpenApiEndpoint>

## 为域名提供 TLS 证书

<OpenApiEndpoint path="/domains/{domainId}/certificates/provision" method="post">
  为您的域名提供 TLS 证书。
</OpenApiEndpoint>
