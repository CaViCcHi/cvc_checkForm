How to use the library: cvc_checkForm.js


Include the file like any other JS between the tags <head> ... </head>

<script type='text/javascript' src='http://your.website.com/js/cvc_checkForm.js'></script>

now add to your  <form ... > this

onsubmit='return CVCmFieldsCheck(this.name);'

With this you are telling your form: "When I press 'submit' place the result of the function as result of the form, if its negative stop everything... otherwise go on"

NB: in order to make onsubmit work, your form HAS TO end with <input type="submit" ... /> or with <input type="image" .. />

now to the instructions:

CVC_mFields_giveInfoFields

(optional)

<input type='hidden' name='CVC_mFields_giveInfoFields' value='noshow' />

This field tells the library not to show a long message, but a short one (es. long message: "- Missing XXX, should be at least YYY chars", short message"- Missing XXX")


CVC_mFields

(mandatory)

<input type="hidden" name="CVC_mFields" value="1|form_news*email|form_news" />


This field tells the library what to check, there are 3 main function up to now:

    * Field Length: Check if the length of the field is at least X. integer
    * E-Mail: Check if the field contains a valid email. email
    * Compare: Check if the 2 fields are identical. strcmp



you can add as many check as you want.

    * Every check is separated by * (asterisk).
    * Inside the checks  FUNCTION and parameters are separated by | (pipe)
    * Parameters are separated each others by , (comma)



FUNCTION|parameter1,parameter2,parameter3*FUNCTION|parameter4,parameter5*FUNCTION....


CVC_mFields_border

(optional)

<input type="hidden" name="CVC_mFields_border" value="all,1,F00|all,1,888" />


This field tells the library how to behave when an input field is doesn't respect the criteria (es. too short, not a valid email... ), then it will color the borders saccording to this field. The two parts are separated by | (pipe)
The first part is evaluated in case of ERROR, the second part is the evaluation that the errant field will have when, after the error, the user will click on this errant field.

ERROR_CASE|BASE_CASE

Inside each part, every parameter is separated by comma (all,1,F00)

The first parameter tells what border to modify:

    * All the borders: all
    * Left Border: left
    * Right Border: right
    * Top Border: top
    * Bottom Border: bottom


The second parameter (integer) is a number and is the width of the border: es. 2 gives a 2 pixel border

The third parameter is the color of the border

NB: The Hexadecimal value of a CSS color can be shortened if is composed by 3 couples: es: FF0000 -> F00, 44FF33 -> 4F3 ... etc
es:

all,1,F00|all,1,888 = In case of error will color the borders of the errant field into #F00 (#FF0000, red) and border 1px, then when someone will click on the errant field it will turn the border into color #888 (#888888, grey) and border 1px

Hope everything is clear

For questions contact me by email or skype: cvc_2k

Matteo Bignotti

This library was entirely written by Matteo Bignotti, all rights reserved

Edit this page (if you have permission) |
Google Docs -- Web word processing, presentations and spreadsheets.


