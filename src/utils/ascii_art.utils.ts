/* eslint-disable no-console */
export const REST_ASCII_ART = `
 ____                                    
|  _ \\   __ _   _ __     __ _    __ _   __ _ 
| |_) | / _\` | | '_ \\   / _\` |  / _\` | / _\` |
|  _ < | (_| | | | | | | (_| | | (_| || (_| |
|_| \\_\\ \\__,_| |_| |_|  \\__, |  \\__, | \\__,_|
                        |___/   |___/        
_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""| 
"'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-' 
                                             
`;

export function displayAsciiArt(ascii_art: string) {
  // eslint-disable-next-line no-undef
  console.warn("\x1b[32m%s\x1b[0m", ascii_art);
}
