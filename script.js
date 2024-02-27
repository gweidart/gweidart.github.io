  function generate() {
    // Get input values
    const charLimit = parseInt(document.getElementById('chars').value);
    const phraseMax = parseInt(document.getElementById('phrase').value);

    // Build regex for unwanted words (validated input)
    const unwanted = document.getElementById('unwanted').value;
    const unwantedRegex = new RegExp(`\\b(${unwanted.replace(/\|/g, '|')})\\b`, 'g');

    // Process input text
    let text = document.getElementById('input').value.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;: {} = \_`~()+]/g, ' ') // remove punctuation
      .replace(/\s+/g, ' '); // replace multiple spaces with single space

    // Separate phrases and remove unwanted words and empty elements
    let output = [];
    let phrases = [];
    let words = [];
    while (text.length > 0) {
      const match = text.match(/".*?"/); // find first phrase
      if (match) {
        phrases.push(match[0].slice(1, -1)); // remove quotes from phrase
        text = text.replace(match[0], ''); // remove phrase from text
      } else {
        const word = text.split(' ', 1)[0]; // get first word
        if (!unwantedRegex.test(word) && word.length > 0) {
          words.push(word);
        }
        text = text.slice(word.length + 1); // remove first word from text
      }
    }

    // Remove duplicate words
    words = [...new Set(words)]; // use spread syntax for unique set

    // Generate all possible combinations of words
    const possiblePhrases = [];
    function generateCombinations(words, currentPhrase, remainingWords) {
      if (remainingWords.length === 0) {
        possiblePhrases.push(currentPhrase.slice()); // copy the phrase
        return;
      }

      for (let i = 0; i < remainingWords.length; i++) {
        const word = remainingWords[i];
        currentPhrase.push(word);
        generateCombinations(words, currentPhrase, remainingWords.slice(i + 1));
        currentPhrase.pop(); // backtrack
      }
    }

    generateCombinations(words, [], words);


    while (output.length < phraseMax) {
      let currentLine = [];
      let remainingChars = charLimit;
      let swappableIndex = -1; // Initialize swappableIndex here
      

      while (possiblePhrases.length > 0 && remainingChars > 0) {
        let bestFitPhrase = null;
        let bestFitRemainingChars = -Infinity;

        // Explore all remaining phrases
        for (let i = 0; i < possiblePhrases.length; i++) {
          const phrase = possiblePhrases[i];
          const phraseLength = phrase.join(' ').length;

          // Check if it fits and doesn't contain used words
          if (phraseLength <= remainingChars && !currentLine.some(word => phrase.includes(word))) {
            // Check for potential swap for better fit
            let swappableIndex = -1;
            for (let j = 0; j < currentLine.length; j++) {
              const swapPhrase = currentLine[j];
              if (remainingChars - phraseLength + swapPhrase.length > bestFitRemainingChars) {
                swappableIndex = j;
                bestFitRemainingChars = remainingChars - phraseLength + swapPhrase.length;
              }
            }

            // Update best fit if applicable
            if (swappableIndex !== -1 || phraseLength > bestFitRemainingChars) {
              bestFitPhrase = phrase;
              if (swappableIndex !== -1) {
                bestFitRemainingChars = remainingChars - phraseLength + currentLine[swappableIndex].length;
              } else {
                bestFitRemainingChars = remainingChars - phraseLength;
              }
            }
          }
        }

        // Add best fit phrase if found
        if (bestFitPhrase) {
          if (swappableIndex !== -1) {
            currentLine[swappableIndex] = bestFitPhrase;
          } else {
            currentLine.push(bestFitPhrase);
          }
          remainingChars = bestFitRemainingChars;
          possiblePhrases.splice(possiblePhrases.indexOf(bestFitPhrase), 1);
        } else {
          break; // No more fitting phrases found for this line
        }
      }

      // Add completed line to output and reset for next line
      if (currentLine.length > 0) {
        output.push(currentLine.join(' '));
      }
      currentLine = [];
      remainingChars = charLimit;
    }

    // Handle remaining unused words:
    if (possiblePhrases.length > 0) {
      // Add all remaining phrases to the last line, separated by spaces
      output[output.length - 1] += ' ' + possiblePhrases.join(' ');
    }

    // Generate output text and display results
    const outputText = output.join('\n');
    console.log(outputText);

  document.getElementById('output').value = outputText;

  // Find unused words (excluding phrases in quotes)
  const unused = words.filter(word => !output.flat().includes(word) && !phrases.includes(word));
  console.log(unused);
  document.getElementById('wordBox').value = unused.join('\n');
}

function generateLists(words, charLimit) {
  const result = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length <= charLimit) {
      result.push([word]);
    } else {
      const remainingWords = words.slice(i + 1);
      const subCombinations = generateLists(remainingWords, charLimit - word.length);
      subCombinations.forEach(combination => result.push([word, ...combination]));
    }
  }
  return result;
}

// (rest of the code remains unchanged)


function checkComplete(unique, outputArray, phraseMax) {
  if (outputArray.length >= phraseMax) {
    return true;
  }
  let count = 0;
  outputArray.forEach(n => {
    if (n) {
      count += n.length;
    }
  });
  return unique.length <= count;
}

function removeDuplicates(words) {
  var seen = {}
  var out = [];
  var j = 0;
  for (var i = 0; i < words.length; i++) {
    var item = words[i];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}
// Get the modal
const modal = document.getElementById('insModal');
// Get the button that opens the modal
const btn = document.getElementById('shwBtn');
// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];
const insImage = document.getElementById('ins-img');
const close = () => (modal.className = 'hidden');
const show = () => (modal.className = 'shown');
// When the user clicks the button, open the modal
btn.onclick = show;
// When the user clicks on <span> (x), close the modal
span.onclick = close;
insImage.onclick = close;

function defaultValues() {
  document.getElementById('input').value = '';
  document.getElementById('output').value = '';
  document.getElementById('wordBox').value = '';
  document.getElementById('chars').value = 20;
  document.getElementById('phrase').value = 13;
  document.getElementById('unwanted').value = 'a|at|and|of|the|in|on|an|has|to|it|is|if|this|that|or|by|for|with';
}
// function copyToClipboard(element)
{
  // const $temp = $('<input>');
  // $('body').append($temp);
  // $temp.val($(element).text()).select();
  // document.execCommand('copy');
  // $temp.remove();
  //
}

function copyOutput() {
  const copyText = document.getElementById('output');
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  document.getElementById('copyTags').innerHTML = 'Copied!';
};
