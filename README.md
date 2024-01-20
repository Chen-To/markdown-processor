# Markdown Processor

## Description 

ToryMD is a simple web-based markdown parser that converts markdown to HTML and displays the result. 
It is built completely from scratch without using any external packages to handle any of the logic of parsing through the markdown input.

### Core Idea

The compiler makes use of concepts that I've learned. It works in 3 stages: a scanning stage, a parsing stage, and a code generation/conversion into html stage.
1. It first scans the input markdown and converts it into tokens (doing some basic checks in the process).
2. It then parses the tokens into a valid syntax tree for markdown (doing the remaining validity checks in the process).
3. It then converts the tokens into html.

## Installation
1. Clone the repository.
2. Run `npm install` to install the dependencies for the project.
3. To build the project based on the dev environment run `npm run build`.
4. Go to <http://localhost:3000/> to view the project.

***

## Future Plans

I am still updating this project and plan to add support for additional features that make the whole editing experience nicer and provide support for additional markdown features that are not already supported. 

The following are potential features I plan to support.

- [ ] Option to view the raw HTML generated.
- [ ] Option to change the theme of the editor.
- [ ] Support for aliasing links in markdown.
- [ ] Support for downloading the output as a PDF.
- [ ] Build custom editor component with line numbers.
