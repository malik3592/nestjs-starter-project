const { execSync } = require('child_process');
const pluralize = require('pluralize'); // Import pluralize for proper pluralization

const moduleName = process.argv[2];
if (!moduleName) {
  console.error('Please provide a module name.');
  process.exit(1);
}

const pluralizedName = pluralize(moduleName); // Pluralized name for modules, controllers, etc.
const singularName = pluralize.singular(moduleName); // Singular name for schema

try {
  console.log(`Generating module: ${pluralizedName}`);
  execSync(`npx nest g module ${pluralizedName}`, { stdio: 'inherit' });

  console.log(`Generating controller: ${pluralizedName}`);
  execSync(`npx nest g co ${pluralizedName} --no-spec`, { stdio: 'inherit' });

  console.log(`Generating service: ${pluralizedName}`);
  execSync(
    `npx nest g service ${pluralizedName}/providers/${pluralizedName} --no-spec --flat`,
    { stdio: 'inherit' },
  );

  console.log(`Generating schema: ${singularName}`);
  execSync(
    `npx nest g class ${pluralizedName}/${singularName}.schema --no-spec --flat`,
    { stdio: 'inherit' },
  );

  console.log(`Generating DTOs: ${pluralizedName}`);
  execSync(
    `npx nest g class ${pluralizedName}/dtos/create-${singularName}.dto --no-spec --flat`,
    { stdio: 'inherit' },
  );
  execSync(
    `npx nest g class ${pluralizedName}/dtos/update-${singularName}.dto --no-spec --flat`,
    { stdio: 'inherit' },
  );

  console.log('Module generation completed successfully.');
} catch (error) {
  console.error('An error occurred during module generation:', error.message);
  process.exit(1);
}
