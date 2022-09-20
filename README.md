<h1 align="center">
  Make Legacy Code Readable Without Touching The Code, Just Using .yaml
  <br><br>
    <img src="https://raw.githubusercontent.com/Leo-Schmit/Apiarist/main/media/before-after.png" width="550">
</h1>

<a href="https://discord.gg/VVNv34Kz5c"><img src="https://img.shields.io/discord/1020001388039778418"></a>

## Getting started

### Install

[Open this extension in the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=LeoSchmit.apiarist)

### Samples

After installation you will see this:<br>
<img src="https://raw.githubusercontent.com/Leo-Schmit/Apiarist/main/media/create_samples.png" width="300"><br>
Click "Create with Samples". The "apiarist" directory will be created and the content will be displayed as follows:<br>
<img src="https://raw.githubusercontent.com/Leo-Schmit/Apiarist/main/media/samples1.png" width="300"><br>

In the "apiarist" directory, you can find a file called "routes.yaml":<br>
<img src="https://raw.githubusercontent.com/Leo-Schmit/Apiarist/main/media/samples2.png" width="560"><br>

- `apiarist_version: 1` - this will help to render content correctly in the future when we have versions 2, 3, etc
- `title: Selector` - you can write any title here
- `routes` - here you can add your routes
  - `name` - any name
  - `id` - specify the path to the .yaml file here. For example `example/create_message_as_seller`
  - `children` - here you can add child elements

Next open example/create_message_as_seller.yaml<br>
<img src="https://raw.githubusercontent.com/Leo-Schmit/Apiarist/main/media/samples3.png" width="560"><br>

- `apiarist_version: 1` - the same as in the previous file
- `viewer` - List of elements to render
  - `call` - ClassName.functionName which you want to display. If you don't have a class, just the name of the function. For different languages, the call may be different. E.g. for java it's ClassName.functionName(Type). You can figure this out in the 'Outline' tab of the vscode explorer: <br><img src="https://raw.githubusercontent.com/Leo-Schmit/Apiarist/main/media/samples4.png" width="260"><br>In case of js the call should be Buyer.example1
  - `regexp` - instead of `call` you can specify a regexp. This can be useful for legacy code where you have very long functions with a lot of logic inside
    - `pattern` - E.g. `(else if[^]*?})`
    - `flags` - You can read about flags [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp#parameters)
  - `name` - any name. In case of absence, the call will be used
  - `icon` - icon name from the icons.yaml file
  - `path` - path to a file where `call` can be found
  - `status` - you can specify `collapsed` here if you want to collapse child elements

apiarist/icons.yaml:<br>
<img src="https://raw.githubusercontent.com/Leo-Schmit/Apiarist/main/media/samples5.png" width="560"><br>

- `apiarist_version: 1` - the same as in the previous file
- `icons` - List of icons
  - `name` - any name
  - `icon` - the name of the VSCode icon. A complete list of icons can be found [here](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing)
  - `iconFile` - you can put your icons in the "icons" directory and use them
    - `light` - icon path for VSCode Light Theme
    - `dark` - icon path for VSCode Dark Theme

## Apiarist on VSCode Web
You can install and try Apiarist on <a href="https://vscode.dev/">https://vscode.dev/</a>

## Any questions? Feel free to ask in the chat!
<a href="https://discord.gg/VVNv34Kz5c"><img src="https://img.shields.io/discord/1020001388039778418"></a>