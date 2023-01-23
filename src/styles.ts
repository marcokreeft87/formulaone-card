import { css } from 'lit';

export const styles = css`    
    table {
        width: 100%;
        border-spacing: 0;
        border-collapse: separate;
        padding: 0px 16px 16px;
    }
    th {
        background-color: var(--table-row-alternative-background-color, #eee);
    }
    th, td {
        padding: 5px;
        text-align: left;
    }
    tr {
        color: var(--secondary-text-color);        
    }
    tr:nth-child(even) {
        background-color: var(--table-row-alternative-background-color, #eee);
    }
    .text-center {
        text-align: center;
    }
    .width-40 {
        width: 40px;
    }
    .width-50 {
        width: 50px;
    }
    .width-60 {
        width: 60px;
    }
    .hide { 
        display: none;
    }
    .strikethrough {
        text-decoration: line-through;
    }
    .italic {
        font-style: italic;
    }
    a {
        text-decoration: none;
        color: var(--secondary-text-color);  
    }
    .constructor-logo {
        width: 20px;
        margin: auto;
        display: block;
        float: left;
        background-color: white;
        border-radius: 50%;
        margin-right: 3px;
    }
`;
