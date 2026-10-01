import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  /** User's email address; validation rejects malformed addresses. */
  @IsEmail()
  email: string;

  /** Plain-text password supplied for authentication; must contain at least 8 characters. */
  @IsString()
  @MinLength(8)
  password: string;
}
