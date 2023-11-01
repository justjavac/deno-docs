import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "开箱即用",
    Svg: require("@site/static/img/deno-box.svg").default,
    description: (
      <>
        Deno 运行时默认支持 TypeScript 和
        JSX，同时还内置了键值存储、代码检查工具、代码格式化工具以及测试库。
      </>
    ),
  },
  {
    title: "默认安全",
    Svg: require("@site/static/img/deno-shield.svg").default,
    description: (
      <>细粒度的权限允许您控制哪些API可以被您的程序及其依赖项访问。</>
    ),
  },
  {
    title: "Deploy globally in seconds",
    Svg: require("@site/static/img/deno-balloon.svg").default,
    description: (
      <>
        Easily create globally distributed app servers with&nbsp;
        <a href="https://www.deno.com/deploy" target="_blank">
          Deno Deploy
        </a>
        .
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => <Feature key={idx} {...props} />)}
        </div>
      </div>
    </section>
  );
}
