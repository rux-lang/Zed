; Comments
[
  (line_comment)
  (doc_comment)
  (block_doc_comment)
  (block_comment)
] @comment

[
  (doc_comment)
  (block_doc_comment)
] @comment.doc

; Attributes
(attribute
  "@" @punctuation.special
  "[" @punctuation.bracket
  "]" @punctuation.bracket) @attribute

(attribute
  name: (identifier) @function.special)

(attribute_argument
  key: (identifier) @variable.parameter)

; Declarations
(function_declaration
  "func" @keyword
  name: (identifier) @function)

(declaration
  name: (type_identifier) @type)

[
  "class"
  "interface"
  "enum"
  "struct"
  "union"
  "type"
] @keyword

; Control flow and modifiers
[
  "break"
  "continue"
  "do"
  "else"
  "for"
  "if"
  "in"
  "loop"
  "match"
  "return"
  "while"
] @keyword.control

[
  "const"
  "let"
  "var"
] @keyword.storage.modifier

[
  "as"
  "async"
  "extend"
  "extern"
  "import"
  "export"
  "module"
] @keyword

; Types and constants
(builtin_type) @type.builtin
(type_identifier) @type
(boolean) @boolean
(null) @constant.builtin
(compile_time_constant) @constant.builtin

; Literals
(number) @number
(string) @string
(escape_sequence) @string.escape

; Parameters and return types
(parameter
  name: (identifier) @variable.parameter)

(return_type
  "->" @punctuation.delimiter)

; Operators and punctuation
(operator) @operator
(punctuation) @punctuation.delimiter
