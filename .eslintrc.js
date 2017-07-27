module.exports = {
//环境定义了预定义的全局变量。更多在官网查看
  "env": {
    "browser": true, // 支持浏览器全局变量的使用
    "es6": true, // 支持es6语法
    "amd": true, // 支持amd语法
    "node": true //支持nodejs全局变量
  },
  "parser": "babel-eslint",// 支持es6语法检查
  "plugins": ['html', 'react'], // html插件支持vue文件和html文件里的js语法检查,react插件支持react语法规范检查
  "extends": ["airbnb"], // 继承airbnb流行的js语法规则
  "rules": {
    // 规范的rules，可以在官方文档查询相关知识
    "no-cond-assign": 2,
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": [
      "error",
      {
        "allow": [
          "warn",
          "error"
        ]
      }
    ],
    "max-len": [
      "error",
      {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true
      }
    ],
    "object-curly-spacing": [
      "error", "always"
    ],
    'quote-props': [
      'error', 'as-needed'
    ],
    'no-param-reassign': 0,
    'radix': ['error', 'always'],//parseInt
    'no-mixed-operators': 0,
    'func-names': ['error', 'never'],
    'object-shorthand':[ //
      'error','always'
    ],
    "arrow-body-style":["error","as-needed"],
    "no-alert": 2, // 禁止使用alert confirm prompt
    "no-array-constructor": 2, // 禁止使用数组构造器
    "no-bitwise": 2, // 禁止使用按位运算符
    "no-caller": 2, // 禁止使用arguments.caller或arguments.callee
    "no-catch-shadow": 2, // 禁止catch子句参数与外部作用域变量同名
    "no-class-assign": 2, // 禁止给类赋值
    "no-constant-condition": 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    "no-control-regex": 2, // 禁止在正则表达式中使用控制字符
    "no-dupe-keys": 2, // 在创建对象字面量时不允许键重复 {a: 1, a: 1}
    "no-empty": 2, // 块语句中的内容不能为空
    "no-empty-character-class": 2, // 正则表达式中的[]内容不能为空
    "no-eval": 2, // 禁止使用eval
    "no-ex-assign": 2, // 禁止给catch语句中的异常参数赋值
    "no-extend-native": 2, // 禁止扩展native对象
    "no-extra-bind": 2, // 禁止不必要的函数绑定
    "no-extra-boolean-cast": 2, // 禁止不必要的bool转换
    "no-fallthrough": 2, // 禁止switch穿透
    "no-func-assign": 2, // 禁止重复的函数声明
    "no-implied-eval": 2, // 禁止使用隐式eval
    "no-inner-declarations": [2, "functions"], // 禁止在块语句中使用声明函数
    "no-invalid-regexp": 2, // 禁止无效的正则表达式
    "no-irregular-whitespace": 2, // 不能有不规则的空格
    "no-label-var": 2, // label名不能与var声明的变量名相同
    "no-labels": 2, // 禁止标签声明
    "no-lone-blocks": 2, // 禁止不必要的嵌套块
    "no-loop-func": 2, // 禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
    "no-mixed-spaces-and-tabs": [2, false], // 禁止混用tab和空格
    "no-multi-spaces": 2, // 不能用多余的空格
    "no-multi-str": 2, // 字符串不能用\换行
    "no-native-reassign": 2, // 不能重写native对象
    "no-negated-in-lhs": 2, // in 操作符的左边不能有!
    "no-new-func": 2, // 禁止使用new Function
    "no-new-object": 2, // 禁止使用new Object()
    "no-new-wrappers": 2, // 禁止使用new创建包装实例，new String new Boolean new Number
    "no-obj-calls": 2, // 不能调用内置的全局对象，比如Math() JSON()
    "no-octal": 2, // 禁止使用八进制数字(因为八进制数字以0开头)
    "no-octal-escape": 2, // 禁止使用八进制转义序列
    "no-proto": 2, // 禁止使用__proto__属性(按照标准，__proto__为私有属性，不应公开)
    "no-redeclare": 2, // 禁止重复声明变量
    "no-regex-spaces": 2, // 禁止在正则表达式字面量中使用多个空格 /foo bar/
    "no-script-url": 2, // 禁止使用javascript:void(0)
    "no-sequences": 2, // 禁止使用逗号运算符
    "no-shadow-restricted-names": 2, // 严格模式中规定的限制标识符不能作为声明时的变量名使用
    "no-spaced-func": 2, // 函数调用时 函数名与()之间不能有空格
    "no-sparse-arrays": 2,  // 禁止稀疏数组， [1,,2]
    "no-trailing-spaces": 2, // 一行结束后面不要有空格( 空白行忽略 )
    "no-undef": 2, // 不能有未定义的变量
    "no-undef-init": 2, // 变量初始化时不能直接给它赋值为undefined
    "no-unreachable": 2, // 不能有无法执行的代码
    "no-unused-vars": 2, // 不能有声明后未被使用的变量或参数
    "no-use-before-define": [2, "nofunc"], // 函数未定义前不能使用
    "no-const-assign": 2, // 禁止修改const声明的变量
    "no-with": 2, // 禁用with,
    "no-var":2,// 不允许使用var声明变量
    "comma-dangle": [2, "never"], // 数组或对象最后不允许出现多余的逗号
    "comma-spacing": 2, // 逗号前面不允许有空格，后面还有东西的时候必须有一个空格
    "curly": [2, "multi-line"], // 块级代码需要换行的时候必须使用 {}将代码裹起来
    "eol-last": 2, // 文件以单一的换行符结束
    "eqeqeq": [2, "allow-null"], // 必须使用全等
    "indent": ["error", 2], // 缩进用tab
    "key-spacing": [2, {
      "beforeColon": false,
      "afterColon": true
    }], // 对象字面量中冒号的后面必须有空格，前面不允许有空格
    "keyword-spacing": [2, {
      "before": true,
      "after": true
    }], // 关键字前后必须存在空格
    "new-parens": 2,// new时必须加小括号 const person = new Person();
    "semi-spacing": [0, {
      "before": false,
      "after": true
    }], // 分号前面不允许有空格，后面有其他东西的时候必须空一空格
    "space-before-blocks": [2, "always"], // 不以新行开始的块 { 前面要有空格
    "space-before-function-paren": [2, "never"], // 函数定义时括号前面不允许有空格
    "space-infix-ops": 2, // 中缀操作符周围必须有空格 a + b
    "no-restricted-syntax": [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in 循环会迭代原型链上你不需要的内容. 使用 Object.{keys,values,entries}，或在array上使用forEach来遍历元素',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    "space-unary-ops": [2, {
      "words": true,
      "nonwords": false
    }], // 一元运算符的前/后如果是单词则空一空格，如果是运算符则不需要空空格 new Foo √  1++ √
    "spaced-comment": [2, "always", { "markers": ["*!"] }], // 注释风格， 双斜杠后面空一格空格再写注释
    "strict": [2, "global"], // 使用全局严格模式
    "use-isnan": 2, // 禁止比较时使用NaN，只能用isNaN()
    "react/no-danger": 0,
    "react/no-array-index-key": 0,
    "react/jsx-no-bind": [0, {"allowBind": true}],
    "jsx-a11y/no-static-element-interactions": 0,
    "import/no-unresolved": [2, { "ignore": ["loader|react-router|css|style|sass|vue"] }],
    "react/jsx-uses-react": 1,
    "react/jsx-no-undef": 2,
    "react/jsx-wrap-multilines": 2,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/forbid-prop-types": 0,
    "global-require": 0,
    "no-nested-ternary": 0,
    "no-underscore-dangle": [1, { "allow": ["__INITIAL_STATE__"] }],
    "jsx-a11y/label-has-for": [0, {
    "components": [ "Label" ],
    "react/require-default-props": 0,
    "no-nested-ternary": 0,
  }]
 }
};
