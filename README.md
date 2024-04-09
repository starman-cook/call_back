

[![N|Solid](https://www.volsor.com/static/img/volsor-logo.png)](https://www.volsor.com/)

# Callback button 

## _instructions:_

* Code  💻
* Running developer version 🏃
* Building a bundle 👷
* Xpath explanations 🌌
* Parameters in initialization 📒
* Important rules in initialization ⚠️
* Information for Web Designer ✏️
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

## Code

I have tried to make my code as simple as possible. There are not so many functions and methods, everything is very simple.\
I did use the typeScript, but right now there are too many "any" types. If someone ever fixes this please don't forget to\
change this text))\
There are a lot of comments that will help you to understand what functions are doing.\
Would like to point out some details in the code:
1) You will see a MutationObserver, that I disconnect right after it was connected. It is necessary to not to have to many requests and to fill the form with data from parameters, query or localStorage.
2) How I prevent tilda and other forms from submitting. My code automatically search for button inside the form and clones it, then replace the old button with my clone, it deletes all the events from button (but not from form, I am talking about  "submit"). Then I change the type of the button to "button", and add eventListener as "click". Now form will not react on this submit, we can do anything we want with the form and it's data.
&nbsp;
&nbsp;
&nbsp;
## Running developer version
```sh
npm i
npm run dev
```
&nbsp;
&nbsp;
&nbsp;
## Building a bundle
```sh
npm run build
```
The file `formintegration.js` will be in folder `/public`

&nbsp;
&nbsp;
&nbsp;
## Xpath explanations

 ## `'//form[@id="' + formSelector + '"]//*[@name="' + name + '"]' + default_field_error_text_path`
This is how it always finds the right input (select or textarea too, but not checkboxes, see next step for checkboxes). 
Then `default_field_error_text_path` this part is what you should place in initialization parameters.
For example:
We have html 
```
<div>
    <input type="text" name="first_name">
    <div class="error_container">
        <p class="error_text"></p>
    </div>
</div>
```
In that case your `default_field_error_text_path` will be `/following-sibling::div/p`
Because div with error is a following sibling of input and it has p inside for the error text.
If there was no <p> inside, then it would be just `/following-sibling::div` (if div has a class, or some other attribute, then you can add the class name like this for example `/following-sibling::div[@class="t-input-error"]`).


&nbsp;
The same thing for checkboxes, but the parameter called `checkbox_field_error_text_path`
If you have html like:
```
<div>
    <div>
        <input type="checkbox"name="checkbox" value="1" required>
        <div class="bad_stuff"></div>

    </div>

    <div class="error">
        <p class="error__text"></p>
    </div>
</div>
```
Then to get to the p inside div with class error will be like `/../../div[@class="error"]/p`

&nbsp;
The same thing for selects, but the parameter called `select_field_error_text_path`
It is exactly the same as default errors or checkbox errors, but in Tilda path can be different, which is why we add this field.



&nbsp;
Then, for the `general_error_text_path` you should write the full path to this container.
For example:
```
<form id="form471257993">
        <div id="myGeneralErrorContainerId">
            <div>
                <p></p>
            </div>
        </div>
        <input type="text" name="first_name">
</form>
```
You will write `//form[@id="form471257993"]//div[@id="myGeneralErrorContainerId"]/div/p`
I hope it is clear enough))
&nbsp;
&nbsp;
&nbsp;
## Parameters in initialization
For parameters you can read [documentation](https://www.volsor.com/panel/promo-tools/public_doc/)
&nbsp;
JSON of parameters looks like this (I filled it with some data to make it more informative):
```
        {
            redirect_url: "https://career.habr.com/companies/volsor",
            add_data_into_static_redirect_url: false,
            meta: {
                "aff": "722ca6702868f800e17ebfd6b27d95f5562faaee",
                "keyword": "text",
                "click_id": "text",
                "spclid": "text",
                "sub1": "textsub1",
                "sub5": "sub5"
            },
            data: {
                checkbox: '3',
                testField: 'TestField',
                country: 'CZ',
                product: 'payday',
                agree: 'yes',
                cell_phone: '222222222',
                period: '2',
                requested_amount: '1000'
            },
            form: "form471257993",
            lang: "string",
            data_transformation: {
                lookups: { 
                    income_type: {
                        default: "OTHER"
                    },
                    first_name: {
                       values: {
                           "Pasha": "Test"
                       }
                    }
                },
                cleanups: {
                    requested_amount: [],
                    period: []
                }
            },
            default_field_error_text_path: "/following-sibling::div/p",
            general_error_text_path: "/div",
            checkbox_field_error_text_path: "/following-sibling::span[@class='error-container']",
            conversions: {
                success: {
                    name: "string",
                    tools: []
                },
                fail: {
                    name: "string",
                    tools: []
                }
            }
        }
```
&nbsp;
&nbsp;
&nbsp;
## Important rules in initialization
* You must create an object from class and then call for init method:
```
new window.FormIntegration().init({..init_parameters})
```
* Form selector must be `id` (but do not add `#` at the beginning) for example `form: "form471257993"`.
* In meta do not add `sub` into field name (for example `submission`) if this field is not going to `subaccounts`.
* Do not place `#` into `redirect_url`, cause this symbol will make a comment of all query string that goes after.
* If you place into `redirect_url` field the same location `/` and add query parameters, for example `?first_name=Test`, then delete `/` symbol before `?` sign. 

&nbsp;
&nbsp;
&nbsp;
## Information for Web Designer 
Form must be in tag `<form>`, do not make raw inputs inside `<div>` or any other non form tag.
Place error containers after each `input` if needed, and remember, that they all must be identical, if you place `div` right after the `input`, then you should place all other `divs` for errors right after `inputs`. Error containers should be `display none`, and `display flex` when showing the error message.
`Do not place one error container for several inputs`, each `input` or `checkbox` should have their own error container.
`For global non-field errors you are free to do anything you want.`


