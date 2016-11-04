# Bitmap transformer

## Description

TODO: Add program description.

## Code Example

```
const Bitmap = require('./lib/bitmap-xfmr');
let myBmp = new Bitmap('example-bitmap.bmp', (err) => { console.log(err || 'Done!'); });
myBmp.transform('redder', 3);
myBmp.writeBufferToFile('images/example-redder3.bmp', (err) => { console.log(err || 'Done writing!'); });
```

## Motivation

This was written as a lab assignment for Code Fellows 401 class.

## API Reference

### Constructor

```myBmp = new Bitmap(filename, [callback(err, data)]);```

Construct a new Bitmap from the data in filename.

### Transformer

```myBmp.transform(label, [arguments])```

Transform the bitmap where label is one of the available transforms:
 - 'redder' makes the image redder by a specified factor
 - 'bluer' makes the image bluer...
 - 'greener' makes the image greener...
 - 'invert' inverts the colors in the image (i.e. new_color = 255 - old_color)
 - 'grayscale' makes the image grayer by a specified factor

Example:

```
myBmp.transform('redder', 3);
myBmp.writeBufferToFile('images/redder3.bmp', (err) => {
  console.log(err || 'Done!');
});
```

### Save to file

```myBmp.writeBufferToFile(filename, [callback(err, data)])```

Write the Bitmap object's buffer out to a .bmp file.

## Tests

The accompanying test suite can be run using the 'npm test' command.

## Contributors

[Mark Greenwood](https://github.com/markgreenwood)

## License

The MIT License (MIT)
Copyright (c) 2016 Mark Greenwood

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
