Screeps TypeScript
==================

This repository is a [Screeps](http://screeps.com) TypeScript type definitions and more.

How to use
----------

Reference `screeps.d.ts` file in your TypeScript source

```js
/// <reference path="Scripts/typings/screeps/screeps.d.ts" />
```

Some string constants from `Game` object have been moved out to reduce pollution of this object. 
If you want to use them you should include minimalistic Screeps library defined in `screeps.lib.ts`
Functions in this library will use lodash, so make sure to include it in your Screeps AI before `screeps.lib.ts` is included.
