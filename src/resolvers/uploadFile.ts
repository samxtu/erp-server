import { Resolver, Arg, Mutation, UseMiddleware } from "type-graphql";
// import { GraphQLUpload } from "graphql-upload";
import { BooleanResponse } from "./branch";
import { isAuth } from "src/middleware/isAuth";
import { Upload } from "src/types";
import { createWriteStream } from "fs";


@Resolver()
export class FileResolver {

// @Mutation(() => BooleanResponse)
//   @UseMiddleware(isAuth)
//   async uploadFile(@Arg("picture", ()=>  ) {createReadStream, filename}: Upload): Promise<BooleanResponse> {
//     return new Promise(async (resolve, reject)=> createReadStream()
//     .pipe(createWriteStream(__dirname+`/../../images/${filename+new Date().toString()}`))
//     .on("finish",()=>resolve({status: true, error: undefined }))
//     .on("close",()=>resolve({status: true, error: undefined }))
//     .on("error", ()=> reject({status: false, error: "Failed to upload" }))
//     )
//   }

}

