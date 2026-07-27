import { IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateJobDto {
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsArray()
    @IsUrl({}, { each: true })
    urls!: string[];
}
