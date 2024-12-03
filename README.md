                                       Prakurthi Diagnosing Assistive Tool for Ayurvedhic Medical Students and Novice Practitioners
                                       
This research aims to create a Diagnostic Assistive Tool for Ayurvedic medical students and novice doctors to accurately determine an individual's Prakruti (body constitution) based on Ayurvedic principles. Prakruti analysis plays a critical role in understanding an individual’s physical, mental, and behavioral traits and helps in recommending personalized treatments and lifestyle practices.

The tool uses a component-based approach:
Face Component: Analyzes facial skin tone, structure, and texture.
Eye Component: Examines eye color, sclera, and patterns to derive key features.
Hair Component: Studies hair texture, density, and shine.
Nail Component: Observes nail texture, shape, and color.
Each component uses separate CNN models to process images/videos collected via a frontend interface and provide a Prakruti classification. The final Prakruti is derived based on the majority result from all components.

In case of a tie between results from different components, the system integrates a questionnaire to analyze the individual's mental and behavioral health, thus refining the final Prakruti diagnosis. This hybrid approach combines deep learning and subjective assessment, ensuring accuracy and adherence to Ayurvedic principles.

The tool aims to:
Assist students and novice doctors by automating Prakruti diagnosis.
Provide an interactive platform for data collection, analysis, and reporting.
Enhance learning through visualization of diagnosis.


Architectural Diagram

![1 drawio](https://github.com/user-attachments/assets/77025c2a-75a7-4fac-ab28-7187371c2678)



Required Dependencies

Programming Languages and Frameworks:
Python 3.8+ (backend development)
React Ionic (frontend framework)

Libraries for Image Processing and Deep Learning
TensorFlow 2.x
Keras
OpenCV
Pandas
NumPy
Matplotlib (for visualization)

Other Tools
VS Code (Implementation platform)
Git (for version control)
Firebase (for storing data)
Google Colab (for model training and experimentation)

