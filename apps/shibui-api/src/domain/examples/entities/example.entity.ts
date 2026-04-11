export enum ExampleFramework {
  VANILLA = 'vanilla',
  ANGULAR = 'angular',
  REACT = 'react',
  VUE = 'vue',
}

export class Example {
  id: string;
  componentId: string;
  title: string;
  description: string | null;
  /** Source code snippet shown in the documentation */
  code: string;
  /** Which microfrontend/framework context this example targets */
  framework: ExampleFramework;
  /** Order within the component's example list */
  order: number;
  /** Whether this is the primary example shown by default */
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
