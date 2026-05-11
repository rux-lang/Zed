const PREC = {
  COMMENT: 2,
  FUNCTION: 1,
};

module.exports = grammar({
  name: "rux",

  extras: $ => [
    /\s/,
    $.line_comment,
    $.doc_comment,
    $.block_doc_comment,
    $.block_comment,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.attribute,
      $.function_declaration,
      $.declaration,
      $.parameter_list,
      $.return_type,
      $.builtin_type,
      $.compile_time_constant,
      $.boolean,
      $.null,
      $.number,
      $.string,
      $.keyword,
      $.type_identifier,
      $.identifier,
      $.operator,
      $.punctuation,
    ),

    line_comment: _ => token(seq("//", /.*/)),
    doc_comment: _ => token(prec(PREC.COMMENT, seq("///", /.*/))),
    block_doc_comment: _ => token(prec(PREC.COMMENT, seq(
      "/**",
      repeat(choice(/[^*]+/, /\*[^/]/)),
      "*/",
    ))),
    block_comment: _ => token(seq(
      "/*",
      repeat(choice(/[^*]+/, /\*[^/]/)),
      "*/",
    )),

    attribute: $ => seq(
      "@",
      "[",
      field("name", $.identifier),
      optional(seq(
        "(",
        optional(commaSep($.attribute_argument)),
        ")",
      )),
      "]",
    ),

    attribute_argument: $ => seq(
      field("key", $.identifier),
      ":",
      choice($.string, $.number, $.boolean, $.null, $.identifier),
    ),

    function_declaration: $ => prec.right(PREC.FUNCTION, seq(
      "func",
      field("name", $.identifier),
      optional($.generic_parameters),
      optional($.parameter_list),
      optional($.return_type),
    )),

    declaration: $ => seq(
      choice("class", "interface", "enum", "struct", "union", "type"),
      field("name", $.type_identifier),
    ),

    generic_parameters: $ => seq(
      "<",
      commaSep1($.type_identifier),
      ">",
    ),

    parameter_list: $ => seq(
      "(",
      optional(commaSep($.parameter)),
      ")",
    ),

    parameter: $ => seq(
      field("name", $.identifier),
      optional(seq(":", $.type_expression)),
      optional(seq("=", choice($.number, $.string, $.boolean, $.null, $.identifier))),
    ),

    return_type: $ => seq(
      "->",
      choice($.type_expression, seq("(", optional(commaSep($.type_expression)), ")")),
    ),

    type_expression: $ => seq(
      repeat(choice("*", "const")),
      choice($.builtin_type, $.type_identifier, $.identifier),
      optional($.generic_parameters),
    ),

    keyword: _ => choice(
      "as",
      "async",
      "break",
      "const",
      "continue",
      "do",
      "else",
      "extend",
      "extern",
      "export",
      "for",
      "if",
      "import",
      "in",
      "let",
      "loop",
      "match",
      "module",
      "return",
      "var",
      "while",
    ),

    builtin_type: _ => choice(
      "bool", "bool8", "bool16", "bool32", "bool64", "bool128", "bool256", "bool512",
      "char", "char8", "char16", "char32", "char64", "char128", "char256", "char512",
      "float", "float8", "float16", "float32", "float64", "float80", "float128", "float256", "float512",
      "int", "int8", "int16", "int32", "int64", "int128", "int256", "int512",
      "opaque",
      "uint", "uint8", "uint16", "uint32", "uint64", "uint128", "uint256", "uint512",
    ),

    boolean: _ => choice("true", "false"),
    null: _ => "null",

    compile_time_constant: _ => token(seq(
      "#",
      choice("package", "module", "file", "function", "line", "column", "date", "time"),
    )),

    number: _ => token(choice(
      seq(/0[xX][0-9a-fA-F_]+/, optional(integerSuffix())),
      seq(/0[oO][0-7_]+/, optional(integerSuffix())),
      seq(/0[bB][01_]+/, optional(integerSuffix())),
      seq(/[0-9][0-9_]*/, optional(seq(".", /[0-9_]+/)), optional(seq(/[eE]/, optional(/[+-]/), /[0-9_]+/)), optional(numericSuffix())),
    )),

    string: $ => seq(
      "\"",
      repeat(choice($.escape_sequence, token.immediate(/[^"\\]+/))),
      "\"",
    ),

    escape_sequence: _ => token.immediate(seq("\\", /./)),

    type_identifier: _ => /_?[A-Z][A-Za-z0-9_]*/,
    identifier: _ => /[A-Za-z_][A-Za-z0-9_]*/,

    operator: _ => token(choice(
      "->",
      "::",
      "..",
      "||",
      "&&",
      "<<",
      ">>",
      "==",
      "!=",
      "<=",
      ">=",
      "+",
      "-",
      "*",
      "/",
      "%",
      "^",
      "|",
      "&",
      "!",
      "?",
      "=",
      "<",
      ">",
    )),

    punctuation: _ => token(choice(",", ".", ":", ";", "(", ")", "[", "]", "{", "}")),
  },
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)), optional(","));
}

function integerSuffix() {
  return choice(
    "i8", "i16", "i32", "i64", "i128", "i256", "i512",
    "u8", "u16", "u32", "u64", "u128", "u256", "u512",
  );
}

function numericSuffix() {
  return choice(
    integerSuffix(),
    "f8", "f16", "f32", "f64", "f80", "f128", "f256", "f512",
  );
}
