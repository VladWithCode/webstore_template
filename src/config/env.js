const PORT = process.env.PORT || 3000;

const STRIPE_SK =
  process.env.STRIPE_SK ||
  'sk_test_51Jl3XdFs0d77yk73JoV6MVGU1IiEavqqx10kyAst0vgpbgcc6hsn9wo3ncZ0J5sJEk1mZXGAC4lI52c8Cw5G9Vuj00ritE6oOh';

module.exports = {
  PORT,
  STRIPE_SK,
};
