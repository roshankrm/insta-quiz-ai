import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import keyword_extractor from 'keyword-extractor';

type Props = {
  answer: string,
  setBlankAnswer: Dispatch<SetStateAction<string>>
}

const BLANKS = '_____';

const BlankAnsInput = ({ answer, setBlankAnswer }: Props) => {
  const keywords = useMemo(() => {
    const words = keyword_extractor.extract(answer, {
      language: "english",
      remove_digits: true,
      remove_duplicates: false,
      return_changed_case: false
    });

    const shuffled = words.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }, [answer]);

  const answerWithBlanks = useMemo(() => {
    const ans = keywords.reduce((acc, keyword) => {
      return acc.replace(keyword, BLANKS);
    }, answer);
    return ans;
  }, [answer, keywords]);

  useEffect(() => {
    setBlankAnswer(answerWithBlanks);
  }, [answerWithBlanks, setBlankAnswer]);

  return (
    <div className='flex justify-start w-full mt-4'>
      <h1 className='text-xl font-semibold'>
        {
          answerWithBlanks.split(BLANKS).map((part, index) => {
            return (
              <React.Fragment key={index}>
                {part}
                {
                  index < answerWithBlanks.split(BLANKS).length - 1 &&
                  <input 
                    className='user-blank-input text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none'
                  />
                }
              </React.Fragment>
            );
          })
        }
      </h1>
    </div>
  )
}

export default BlankAnsInput