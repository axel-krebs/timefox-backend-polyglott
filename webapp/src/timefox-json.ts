/* Copied from https://github.com/YousefED/typescript-json-schema! */
import * as TJS from 'typescript-json-schema';
import path = require('path');
import fs = require('fs');

var outputFilePath = "gen-json.tmp"; // default
const args = process.argv.slice(2);
const searchDirArg = args[0];
const searchClassesArg = args[1];
const symbolsArg = args[2];
const outFileArg = args[3];

if(typeof searchDirArg == undefined || typeof searchClassesArg == undefined || symbolsArg == undefined){
	throw new Error('Parameters must be given, e.g. "--search-dir=src/Record --search-classes=Entity --symbols=Entity,TimeRecord --outfile=timefox-client.json"');
}
const searchDir = searchDirArg.substring(searchDirArg.indexOf("=")+1, searchDirArg.length);
const symbolsArrayConcat = symbolsArg.substring(symbolsArg.indexOf('=')+1, symbolsArg.length);
const symbolsArray = symbolsArrayConcat.split(',');
const searchClassesConcat = searchClassesArg.substring(searchClassesArg.indexOf('=')+1, searchClassesArg.length);
const scArray = searchClassesConcat!.split(',');
const seachClassesResolved = new Array();
for (const tsClass of scArray){
    seachClassesResolved.push(path.resolve(searchDir + '/' + tsClass));
}
if(outFileArg != null) {
	outputFilePath = outFileArg.substring(outFileArg.indexOf('=')+1, outFileArg.length);
}
 
// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
    required: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
};

// optionally pass a base path
const basePath = path.resolve(searchDir);

const program = TJS.getProgramFromFiles(
  seachClassesResolved,
  compilerOptions,
  basePath
);

// We can either get the schema for one file and one type...
//const schema = TJS.generateSchema(program, "TimeRecord", settings);

// ... or a generator that lets us incrementally get more schemas
const generator = TJS.buildGenerator(program, settings);

if(generator != null) {

	// all symbols
	//const symbols = generator.getUserSymbols();

	// Get symbols for different types from generator.
	const tfEntitySchema = generator.getSchemaForSymbols(symbolsArray);
	
	var filePath = path.join(__dirname, outputFilePath);
	fs.openSync(filePath, "w");
	fs.appendFileSync(filePath, JSON.stringify(tfEntitySchema));
}