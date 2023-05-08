import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";

interface ClassConstructor {
    new(...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) { }

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        console.log("context is ", context, "and handler is", handler);
        return handler.handle()
            .pipe(
                map((data: any) => {
                    return plainToClass(this.dto, data, {
                        excludeExtraneousValues: true
                    })
                }))
    }
}