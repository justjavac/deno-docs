import OpenApiEndpoint from "@site/src/components/OpenApiEndpoint";

# 项目

项目是部署的容器，可以与组织中的域和 KV 数据库关联。

## 获取项目详情

<OpenApiEndpoint path="/projects/{projectId}" method="get">
  通过唯一 ID 获取项目的元信息。
</OpenApiEndpoint>

## 更新项目详情

<OpenApiEndpoint path="/projects/{projectId}" method="patch">
  更新项目的元信息。
</OpenApiEndpoint>

## 删除项目

<OpenApiEndpoint path="/projects/{projectId}" method="delete">
  通过唯一 ID 删除项目。
</OpenApiEndpoint>

## 获取项目分析

<OpenApiEndpoint path="/projects/{projectId}/analytics" method="get">
  获取指定项目的分析数据。分析数据以 15 分钟的间隔返回时间序列数据，其中 <code>time</code> 字段表示间隔的开始。
</OpenApiEndpoint>

## 获取项目部署

<OpenApiEndpoint path="/projects/{projectId}/deployments" method="get">
  获取属于指定项目的部署的分页列表。如果需要，响应的 <code>Link</code> 头中会返回下一页、上一页、第一页和最后一页的 URL。
</OpenApiEndpoint>
