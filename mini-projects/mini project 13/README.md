## 1. diff in
```
input.value
```
and
```
input.getAttribute("value")
```
the main diff is input.value changes when user types and returns the live value of the instance on which it is called where as the input.getattribute does not change dynamically and return static value from html code.

## 2. Event propagation demonstration
let get an example 
```
In Html:
<div id='grandfather'>
    <div id='father'>
        <div id='child'>
            <button id='button'>Play</button>
        </div>
    </div>
</div>
```
```
In js:
let grandfather = document.getElementById("grandfather");
let father = document.getElementById("father");
let child = document.getElementById("child");
let button = document.getElementById("button");

button.addEventListener("click", function(){
    console.log("button clicked");
})
child.addEventListener("click", function(){
    console.log("child clicked");
})
father.addEventListener("click", function(){
    console.log("father clicked");
})
grandfather.addEventListener("click", function(){
    console.log("grandfather clicked");
})
```
here the event propagation mechanism will take place.

### first phase I:
#### Event capturing:
here when the button is clicked the event travels from root (grandfather here) to its target element where it gets called
so the event travels the DOM tree from :

grandfather ➡️ father ➡️ child ➡️ button

### phase II:
#### target:
here the event gets called on target node

### phase III:
#### Event Bubbling
here after getting called at target node the event does not stop and goes to its parent node until the root element

button ➡️ child ➡️ father ➡️ grandfather

so in the console we get:
```
button clicked
child clicked
father clicked
grandfather clicked
```

## 3. Browser Rendering Pipeline:

<div align="center">
  <img src="https://imgs.search.brave.com/CLhTiQ2w2I8K7eMonAy9r7T-pVkyKTkwB5-vfT8UuRQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93ZWJw/ZXJmLnRpcHMvc3Rh/dGljLzRlNzNjOTk5/MmNlM2I5MTc3YmNj/ODBhMjExM2IzMTM4/LzkwNmI1L0Jyb3dz/ZXJSZW5kZXJpbmdQ/aXBlbGluZTAxLnBu/Zw" alt=" Screenshot" width="600">
</div>

Broser do not understand the html and css directly and js also can not directly manipulate html, but it can manipulate the DOM. manipulate se yaad aya...khair chodo.

for html:
1. the html code is considered as a string by browser
2. the string is sent to tokenization where each part of code is gets breaked into smal pieces of tokens.
3. after that it is parsed where each node is converted into a node and text or content is converted ito children of nodes.
4. then the parser converts it into DOM tree.

for css:
1. the css string is sent into tokenization process
2. then after tokenization it is parsed.
3. after parsing it directly converted into CSSOM tree.

- JavaScript executes during HTML parsing and can modify the DOM and CSSOM before rendering.

I. and after both processes both DOM and CSSOM tree are combined to a single render tree.

II. after render tree the layout is created, each element gets size and where to show on screen

III. after that paint is done, the elements gets drwan based on previous data

IV. later in layer creation some elements got specific properties like transform opacity, rather than repainting the whole page they got some extra layers.

V. after layer creation, in compositioning the GPU helps to combine all layers to be visible on screen