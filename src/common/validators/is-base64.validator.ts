import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import uploadFile from '../../utils/file-upload.util';

export function IsBase64(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBase64',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      async: true, // Mark the validator as asynchronous
      validator: {
        async validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false; // Must be a string

          const regex = /^(data:image\/[a-zA-Z]+;base64,)?[A-Za-z0-9+/=]+$/; // Base64 regex
          if (!regex.test(value)) return false; // Check if it's a valid Base64 string

          // Call uploadFile to save the file and return the file path
          try {
            const filePath = await uploadFile(
              value,
              args.property + Date.now(),
            ); // Replace with your actual upload function
            (args.object as any)[propertyName] = filePath; // Replace the Base64 value with the file path
            return true;
          } catch (error) {
            console.error('File upload failed:', error);
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid base64 encoded string or a valid image file path`;
        },
      },
    });
  };
}
