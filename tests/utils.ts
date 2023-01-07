import { HTMLTemplateResult } from "lit";

export const getRenderString = (data: HTMLTemplateResult) : string => {
    
    let returnHtml = '';
    if(!data) {
        return returnHtml;
    }

    const {strings, values} = data;

    if(strings === undefined) {
        return returnHtml;
    }
    
    for(let i = 0; i < strings.length; i++) {
        
        returnHtml += strings[i];

        if(typeof values[i] === 'string') {
            returnHtml += values[i];
        }
        if(typeof values[i] === 'function') {
            // eslint-disable-next-line @typescript-eslint/ban-types
            returnHtml += (values[i] as Function).name;
        }
        else if(typeof values[i] === 'object') {
            const templates = values[i] as HTMLTemplateResult[];
            if(templates !== undefined && templates !== null) {
                for(let i = 0; i < templates.length; i++) {
                    returnHtml += getRenderString(templates[i] as HTMLTemplateResult);
                }
            }

            const template = values[i] as HTMLTemplateResult;
            if(template !== undefined && templates !== null) {
                returnHtml += getRenderString(template);
            }
        } 
    }

    return returnHtml.replace(/\s\s+/g, ' ');
}

export const getRenderStringAsync = async (data: HTMLTemplateResult) : Promise<string> => {
    
    let returnHtml = '';
    if(!data) {
        return returnHtml;
    }

    const {strings, values} = data;

    if(strings === undefined) {
        return returnHtml;
    }
    
    for(let i = 0; i < strings.length; i++) {
        
        returnHtml += strings[i];

        if(typeof values[i] === 'string') {
            returnHtml += values[i];
        }
        if(typeof values[i] === 'function') {
            // eslint-disable-next-line @typescript-eslint/ban-types
            returnHtml += (values[i] as Function).name;
        }
        else if(typeof values[i] === 'object') {
            const templateResult = <HTMLTemplateResult>values[i];
            if(templateResult) {

                for(let i = 0; i < templateResult.values.length; i++) {
                    if(templateResult.values[i] instanceof Promise) {
                        const promise = <Promise<HTMLTemplateResult>>templateResult.values[i];
                        
                        const promiseResult = await promise;
                        returnHtml += getRenderString(promiseResult)
                    }
                    else {
                        const templates = templateResult.values[i] as HTMLTemplateResult[];
                        if(templates !== undefined && templates !== null) {
                            for(let i = 0; i < templates.length; i++) {
                                returnHtml += getRenderString(templates[i])//, iteration + 1);
                            }
                        }

                        const template = templateResult.values[i] as HTMLTemplateResult;
                        if(template !== undefined && template !== null) {
                            returnHtml += getRenderString(template)//, iteration + 1);
                        }
                    }
                }
            }
        } 
    }

    return returnHtml.replace(/\s\s+/g, ' ');
}

export const getRenderStringAsyncIndex = async (data: HTMLTemplateResult, origin?: string) : Promise<string> => {
    
    let returnHtml = '';
    if(!data) {
        return returnHtml;
    }

    const {strings, values} = data;

    // if(origin !== undefined) {

    //     console.log(origin, strings);
    //     console.log(origin, data);
    // }

    if(strings === undefined) {
        return returnHtml;
    }

    for(let i = 0; i < strings.length; i++) {
        
        returnHtml += strings[i];

        if(i >= values.length) {
            continue;
        }
        
        if(typeof values[i] === 'string') {
            returnHtml += values[i];
        }
        else if(typeof values[i] === 'object') {
            // if(origin !== undefined)
            //     console.log(origin, (values[i] as HTMLTemplateResult).values[0]);
            const templates = <HTMLTemplateResult[]>values[i];
            if(templates !== undefined) {

                for(let j = 0; j < templates.length; j++) {
                    returnHtml += await getRenderStringAsyncIndex(templates[j], 'tempaltes');
                }
            }      
            
            const templateResult = <HTMLTemplateResult>values[i];
            for(let j = 0; j < templateResult.values.length; j++) {
                if(templateResult.values[j] instanceof Promise<HTMLTemplateResult>) {
                    const promise = <Promise<HTMLTemplateResult>>templateResult.values[j];
                    const promiseResult = await promise;
                    returnHtml += await getRenderStringAsyncIndex(promiseResult, 'instanceof');
                    //console.log('values[5]', promiseResult.values[4]);
                    //console.log(promiseResult);
                }
                else {
                    

                    // const template = <HTMLTemplateResult>templateResult.values[j] as ;
                    // if(template !== undefined && template !== null) {
                    //     returnHtml += await getRenderStringAsync(template, 'template')//, iteration + 1);
                    // }
                    //console.log(templateResult);
                    //console.log(templateResult.values[0] instanceof Promise<HTMLTemplateResult>)
                    returnHtml += await getRenderStringAsyncIndex(templateResult, undefined);
                }
            }


            // if(values[i] instanceof Promise<HTMLTemplateResult>) {
            //     const promise = <Promise<HTMLTemplateResult>>values[i];
            //     const promiseResult = await promise;
            //     returnHtml += await getRenderStringAsync(promiseResult);
            //     console.log(promiseResult);
            // }
            // else if(templateResult) {
            //     console.log(templateResult);
            //     console.log(templateResult.values[0] instanceof Promise<HTMLTemplateResult>)
            //     returnHtml += await getRenderStringAsync(templateResult);
            // }
        }
        
        
        // else if(typeof values[i] === 'string') {
        //     returnHtml += values[i];
        // }

    //     if(typeof values[i] === 'string') {
    //         returnHtml += values[i];
    //     }
    //     if(typeof values[i] === 'function') {
    //         // eslint-disable-next-line @typescript-eslint/ban-types
    //         returnHtml += (values[i] as Function).name;
    //     }
    //     else if(typeof values[i] === 'object') {
    //         const templateResult = <HTMLTemplateResult>values[i];
    //         if(templateResult) {

    //             for(let i = 0; i < templateResult.values.length; i++) {

    //                 console.log((<HTMLTemplateResult>templateResult.values[i]));
    //                 //if(templateResult.values[i])

    //                 if(templateResult.values[i] instanceof Promise) {
    //                     const promise = <Promise<HTMLTemplateResult>>templateResult.values[i];
                        
    //                     const promiseResult = await promise;
    //                     console.log(promiseResult);
    //                     returnHtml += await getRenderStringAsync(promiseResult)
    //                 }
    //                 else {
    //                     const templates = templateResult.values[i] as HTMLTemplateResult[];
    //                     if(templates !== undefined && templates !== null) {
    //                         for(let i = 0; i < templates.length; i++) {
    //                             returnHtml += getRenderString(templates[i])//, iteration + 1);
    //                         }
    //                     }

    //                     const template = templateResult.values[i] as HTMLTemplateResult;
    //                     if(template !== undefined && template !== null) {
    //                         returnHtml += getRenderString(template)//, iteration + 1);
    //                     }
    //                 }
    //             }
    //         }
    //     } 
    }

    return returnHtml.replace(/\s\s+/g, ' ');
}