# API Errors

There are two kinds of errors:
- `Validation`: these are thrown by NestJS and are defined in `dto` folders with the following format: `<FIELD>: <MESSAGE>`.\
  Example: `password: The password cannot be empty`.
- `Others`: these are thrown using a class that extends `HttpException` from `@nestjs/common`, with some already built-in, like `NotFoundException`. The first argument must be an array of strings which are the error messages and these need to follow the same rules as the validation ones.\
  Example: `throw new NotFoundException(['email: A user with this email does not exist']);`.
