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