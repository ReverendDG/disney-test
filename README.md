# disney-test

Here I will explain some of my assumptions and decisions in no particular order.

1) The instructions referred to a "refId" in each collection. There wasn't always one. I noticed, however, that, when there was no refId, there was a setId. The subsequent tree structure implied that they served the same purpose. I based my code on that assumption.

2) The associated image arrays were quite vast. There was no clear indication that I could find that said "use this one" so I perused many of the images and found that the image associated with "1.78" was always the one that seemed like the right one. I wrote this code based on the assumption that that was the intended image.

3) This was only tested on Chrome, Version 104.0.5112.101, on a PC. Given more time, I would expand testing to other browsers and devices as well.

4) I made the assumption that the user was not intended to be able to scroll in any manner other than using the arrow keys. All other keys (except Enter and Backspace) and mouse-based scrolling, were disabled. The "Enter" key was chosen to select a highlighted tile and "Backspace" was chosen to close the information modal and return to the title list. Further code was implemented to prevent any navigation of the title list behind an open information modal.

5) The assumptions were made that we wanted the user to be able to navigate forward from the end of a row to the beginning of the row, as well as the reverse. Also, the assumption was made that we did NOT want a user navigating UP from the top row to the bottom row, and vice versa. A third assumption was made that whenever the user navigated to a new row, it took them to the beginning of that row, regardless of their position in the previously selected row, or where they might have been in the newly selected row at a different time. 

6) There was not much information available on each title in order to populate the information modal. As such, I simply chose to display the title and, if available, the rating. This was done more as a proof of concept, rather than an exhaustive display of information.

7) I acknowledge that my method of determining a broken image may not be the most efficient and welcome other ideas. I attempted several other, more efficient methods, however they all failed for various reasons. This method was the only one that I was able to successfully execute.

I'm, of course, happy to answer any and all other questions regarding this code during the panel review.

