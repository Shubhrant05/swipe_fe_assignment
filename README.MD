# Swipe Task : Invoice Creation Form with Redux 

---

## Introduction

This project is particularly focussed on createing a Invoice Creation web app as a part of internship task from Swipe, suing ReactJS and ReduxJS. The primary goal was to create a robust and feature-extensive application which can handle complex state management while we can use new functionalities such as currency conversion. During development, I focussed on ensuring code quality, scalability, and user experience.

## Project Scope

The primary features of the project contains several key aspects:

1. **Invoice Creation Form**: A dynamic form interface was designed to facilitate the creation of detailed invoices. Users could input various details such as invoice number, billing information, line items, discounts and taxes.

2. **Product Tab Integration**:  Using Redux.js, I made a dedicated product tab in the application.
I have created a new file in ```Redux``` folder called ```productSlice.js```. This file contains three major reducer for handling the products state during the app creation, which actually proved to be very useful. These three reducer were :

       1. addProduct - This reducer was helpful in adding a new product to existing products array in store. Taking the new item as the payload and pushing to existing state.

       2. updateProduct - This reducer was helpful in updating an exisiting product in store. It took the updated product as payload and then updated it in the store.

       3. deleteProduct - This reducer was helpful in deleteing an exisiting product in store by going over the array and filtering out the item by ID so that we can get a new array of required items.

    This tab provided users with easy access to view all products associated with invoices, enhancing overall usability and convenience.

3. **Currency Conversion Feature**: One of the most remarkable and difficult to add features of the application was the currency conversion functionality. Through integration with an external ```freecurrency API```, I was able to get conversion rates to different currencies. However due to complex states it was becoming highly difficult to maintain synchnization. Therefore I added a new field in state called ```itemPriceInDollar``` using this I can always get the base price in dollar and multiply it with different conversion rate to get different currencies. This added versatility and global usefulness to the application.

4. **Error Handling Mechanisms**: I tried to find and fix possible exisiting error in the existing codebase. I have also added ```null``` and ```undefined``` checks at places to maintain the integrity.I also included validation checks, error message etc.

5. **Notification System**: To provide users with timely feedback, updates and error messages, I added a notification system using the React Hot Toast library. Notifications were triggered for various events such as successful actions, errors, and important updates.

## Future Enhancements

Although currently working on the project I wa sable to add some great features to it but as we all know there is always room for improvement and growth.:

1. **Database Integration**: Well, the major problems which I faced while creating the app mainly arose due to lack of a non-volatile storage. Integrating a database would allow for persistent storage of invoice data, enabling advanced features such as data retrieval, analytics, and user management.

2. **Enhanced Editing Functionality**: Although the current app supports editing but it can be made even better and more intuitive. Improving the editing options of the application would further simplify the invoice creation process. Features such as inline editing, drag-and-drop functionality, and bulk editing could be added later-on.

3. **UI/UX Enhancements**: Future refinement of the user interface and experience is essential for ensuring user satisfaction. This could involve optimizing layout and navigation, and incorporating interactive elements.

4. **Localization and Internationalization**: Expanding language support and adapting the application to different regions and languages would broaden its accessibility and appeal to a global audience.

## Challenges Faced and Key Learnings

While making the invoice creation form, I encountered several challenges, especially when integrating Redux.js for state management. Understanding Redux concepts and seamlessly integrating them into the existing codebase with so many states required good amount of planning and problem-solving.

Fixing the pre-existing code's shortcomings was another challenge. It involved debugging and enhancing code readability, which demanded careful analysis and decision-making.

Despite the challenges, navigating through them was an nice experience. It provided valuable insights into React.js, Redux.js, and modern web development practices. Each challenge presented an opportunity for creative problem-solving and innovation.

Overall, working on this task was rewarding. It helped to practice my technical skills and push my creative boundaries. 

## Conclusion

In conclusion, the invoice creation form project represents a significant project and web-app knowledge test. By using React.js, Redux.js, and other modern technologies, I made the app highly functional and versatile. 


