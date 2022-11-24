import path from "path";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import alias from "rollup-plugin-alias";

let aliases = {
  resolve: [".ts", ".js"],
  entries: [
    {
      find: /@lib(.*)/,
      replacement: path.resolve(process.cwd(), "./dist$1.js"),
    },
  ],
};

function isExternal(id) {
  /*
    Here, `id` is "./db", as in

      import db from './db'
  */
  let isRelativeInternalModulePath = id.startsWith(".");

  /*
    Here, `id` is something like

      "/Users/samselikoff/Projects/oss/miragejs/miragejs/lib/identity-manager.js"

    I'm not sure how this happens, but it's referencing an internal module, so
    it shouldn't be treated as external.
  */
  let isAbsoluteInternalModulePath = id.includes(
    path.join(process.cwd(), "dist")
  );

  /*
    Here, `id` is something like '@lib/assert', which is not a path but does
    reference an internal module. So it shouldn't be treated as external.
  */
  let isAlias = Boolean(
    aliases.entries.find((entry) => {
      if (entry.find instanceof RegExp) {
        return entry.find.test(id);
      } else if (typeof entry.find === "string") {
        return id.startsWith(entry.find);
      }
    })
  );

  return (
    !isRelativeInternalModulePath && !isAbsoluteInternalModulePath && !isAlias
  );
}

const onwarn = (warning) => {
  // Skip certain warnings

  // should intercept ... but doesn't in some rollup versions
  if (warning.code === "THIS_IS_UNDEFINED") {
    return;
  }

  // console.warn everything else
  console.warn(warning.message);
};

let esm = {
  input: "dist/index.js",
  output: { file: `dist/mirage-esm.js`, sourcemap: true, format: "esm" },
  external: isExternal,
  plugins: [
    alias(aliases),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      sourceMaps: true,
      presets: [["@babel/typescript", {}]],
    }),
  ],
  onwarn,
};

let cjs = {
  input: "dist/index.js",
  output: {
    file: `dist/mirage-cjs.js`,
    sourcemap: true,
    format: "cjs",
    esModule: true,
  },
  external: isExternal,
  plugins: [
    alias(aliases),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
      sourceMaps: true,
      presets: [
        [
          "@babel/typescript",
          {
            targets: { node: "current" },
          },
        ],
      ],
    }),
    nodeResolve(),
  ],
  onwarn,
};

let umd = {
  input: "dist/index.js",
  output: {
    file: "dist/mirage-umd.js",
    format: "umd",
    name: "MirageJS.Server",
  },
  plugins: [
    commonjs(),
    alias(aliases),
    nodeResolve(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
      sourceMaps: true,
      presets: [
        [
          "@babel/typescript",
          {
            useBuiltIns: "usage",
            corejs: 3,
            modules: false,
            targets: "ie 11",
          },
        ],
      ],
    }),
  ],
  onwarn,
};

export default [esm, cjs, umd];
