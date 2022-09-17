export const routesContent = `apiarist_version: 1

title: Selector
routes:
  - name: Routes
    children:
    - name: Seller
      children:
        - name: POST /v1/message
          id: example/create_message_as_seller
    - name: Buyer
      children:
        - name: POST /v1/message
          id: example/create_message_as_buyer
  - name: Components
    children:
      - name: Seller
        id: example/seller
      - name: Buyer
        id: example/buyer
`;
