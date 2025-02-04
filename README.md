# NC Freelance Project - Museum Curator

The goal of this project was to create a platform that allows users to interact with data from multiple APIs. The project focuses
on interacting with museum/exhibition data and presenting it in a simple and interactable manner. In it's current rendition, it's suitable as a webpage but not yet tailored to mobile platforms.

## Project Link

https://github.com/ShaunRainey/Museum

https://app.netlify.com/sites/sr-museum/overview

## Installation

Key installs:

```
npm install
```
```
npm install react-router-dom
```
```
npm install axios
```
```
npm install react-bootstrap bootstrap
```
```
npm run dev
```

To prepare the project for Netlify:

- npm run build
    - This should create a dist file in the project root directory
- Due to how Netlify works with route finding, a _redirects file is necessary in the dist file
    - If necessary "postbuild": "copy _redirects dist\\_redirects" should be added to scripts in package.json
    - This will require manually creating the _redirects file in the root directory with contents "/*    /index.html   200"
    - Each time run build is used, _redirects should be created with the dist file

## Key Components / Functionalities

### Home Page

This page will render 9 random images, initially from the Met Museum. Can select Victoria & Albert Museum too. Images can be clicked, where 
you will be taken to an individual artwork page

### All Artworks

This page renders a significant number of artworks from a museum of choice. This is also the first instance of pagination. Any query entered
into the quick search box in the nav bar will be routed to this page

### Detailed Search

Initially a search form will be presented. Due to how the Met museum API works, a query is highly recommended. Otherwise the API call will take
a long time, especially with larger page/result numbers. The following options are available:

Met Museum:
    - Filter by department
    - Keyword search (enter query)
    - Maximum pages - This will set a limit for results to be displayed
    - Results per page - This will set a limit for the number of results rendered on a page
    - Sort by

VAM:
    - Keyword search
    - Maximum pages
    - Results per page
    - Sort by

### Individual Artworks

By clicking on an image, you'll be taken to an individual artwork page. Key information about the artwork is presented. Due to lack of descriptions offered by the API, a link to the original piece is also provided. 

There is a button to save an artwork into saved exhibitions after providing a collection name.

### Saved Exhibitions

This section will present any saved exhibitions and allow management. By clicking an exhibition, you can view/delete saved artworks. This system currently uses local storage.

## Future Expansions

- Proper user account implementation 
- Swap from local storage to a database system for saved artworks
- Addition of further APIs
- Complete mobile screen compatibility
