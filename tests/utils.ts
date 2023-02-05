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

export const getRenderStringAsyncIndex = async (data: HTMLTemplateResult) : Promise<string> => {
    
    // loop through the strings and values and build the html string iteratively
    // if the value is a string, add it to the html string
    // if the value is an object, check if it is a template result or an array of template results
    // if it is a template result, call this function recursively
    // if it is an array of template results, loop through the array and call this function recursively for each item
    // if the value is a promise, await the promise and call this function recursively
    // if the value is a function, add the function name to the html string
    // if the value is undefined, add an empty string to the html string
    // if the value is null, add an empty string to the html string
    // if the value is a number, add the number to the html string
    // if the value is a boolean, add the boolean to the html string
    //

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

        if(i >= values.length) {
            continue;
        }
        
        if(typeof values[i] === 'string') {
            returnHtml += values[i];
        }
        else if(typeof values[i] === 'object') {
            const templates = <HTMLTemplateResult[]>values[i];
            if(templates !== undefined) {
                
                for(let j = 0; j < templates?.length; j++) {
                    returnHtml += await getRenderStringAsyncIndex(templates[j]);
                }
            }      
            
            const templateResult = <HTMLTemplateResult>values[i];
            for(let j = 0; j < templateResult?.values.length; j++) {
                if(templateResult.values[j] instanceof Promise<HTMLTemplateResult>) {
                    const promise = <Promise<HTMLTemplateResult>>templateResult.values[j];
                    const promiseResult = await promise;
                    returnHtml += await getRenderStringAsyncIndex(promiseResult);
                }
                else {
                    returnHtml += await getRenderStringAsyncIndex(templateResult);
                }
            }
        }
    }

    return returnHtml.replace(/\s\s+/g, ' ');
}

