# ionic-bond

---

[![Auto Test CI](https://github.com/DarrenDanielDay/ionic-bond/actions/workflows/test.yml/badge.svg)](https://github.com/DarrenDanielDay/ionic-bond/actions/) [![Publish CI](https://github.com/DarrenDanielDay/ionic-bond/actions/workflows/publish.yml/badge.svg)](https://github.com/DarrenDanielDay/ionic-bond/actions/) [![npm version](https://badge.fury.io/js/ionic-bond.svg)](https://badge.fury.io/js/ionic-bond)

一个用于更新 JavaScript 应用程序中不可变状态的库。

## 介绍

这个库是一个非常轻量的`immer`替代品，核心实现也是借助`Proxy`的魔法，但导出的 API 只有一个`solvent`函数。

换言之，如果您正在为下面这样繁琐的代码发愁，您可以尝试`ionic-bond`，但不必引入庞大的`immer`。

```js
setState((prev) => ({
  ...prev,
  userStore: {
    ...prev.userStore,
    currentUser: {
      ...prev.userStore.currentUser,
      userName: "some updated user name",
    },
  },
}));
```

使用`ionic-bond`，您的代码将看起来像这样：

```js
import { solvent } from "ionic-bond";

setState(
  (prev) =>
    solvent() // 如果您正在使用`TypeScript`，您可以使用`solvent<YourType>()`来获取`obj`参数的类型推断。
      .ionize((obj) => obj.userStore.currentUser.userName)
      .dissolve(prev)
      .crystallize("some updated user name") // 将返回一个更新了`userName`的新对象
);
```

这样的 API 命名是因为这种更新对象的形式非常像是将一些晶体溶解在溶剂里，然后替换溶液里的部分离子并重结晶一样。

尽管这些 API 可以设计成一个函数接受三个参数，但为了方便属性选择器和更新前对象的复用，他们是分级的，也就是在 API 层面进行了柯里化。

## 许可证

```text
 __________________
< The MIT license! >
 ------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
