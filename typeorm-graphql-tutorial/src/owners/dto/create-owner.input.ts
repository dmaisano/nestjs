import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOwnerInput {
  @Field()
  name: string;
}
