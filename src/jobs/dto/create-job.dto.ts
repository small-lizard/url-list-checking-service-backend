import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateJobDto {
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    urls!: string[];
}