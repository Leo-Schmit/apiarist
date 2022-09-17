export const createMessageAsSellerContent = `apiarist_version: 1

viewer:
  - call: Example.example1 # For different languages, the call may be different. E.g. for Java it's ClassName.functionName(Type) 
    name: Example.example1 # Any name. In case of absence, the call will be used
    icon: good # Icon name from the icons.yaml file
    path: apiarist/example/example.js
    children:
    - call: Example.example2
      icon: folder
      path: apiarist/example/example.js
      children:
        - call: Example2.example1
          icon: database
        - name: example2
          regexp: 
            pattern: (const x2.*?;)
          icon: database
        - name: example3
          regexp: 
            pattern: (else if[^]*?})
            flags: gi # You can read about flags here - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp#parameters
          icon: database
        - name: Seller.tests
          call: Seller.tests
          status: collapsed # You can specify 'collapsed' here if you want to collapse child elements
          children:
            - call: Seller.tests2
`;
