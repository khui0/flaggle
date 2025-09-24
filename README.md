<img src="https://github.com/khui0/flaggle/assets/101839505/74edb39b-2f66-4a2e-a203-722aeed80353" height=128>

# Flaggle

![GitHub package.json version](https://img.shields.io/github/package-json/v/khui0/flaggle?color=%23366aed)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/khui0/flaggle?color=%23366aed)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fflaggle.kennyhui.dev%2F&color=%23366aed)

### Play here: [flaggle.kennyhui.dev](https://flaggle.kennyhui.dev/)

Web-based flag recognition game with fuzzy search + keyboard shortcuts.

## How to play

Choose between [Daily](#daily), [Classic](#classic), and [Lightning](#lightning)

### Classic

Your goal is to guess a random **target** flag. Start by picking a country. Once you guess, you'll be shown similarity between your guess and the target.

<img width="783" alt="image" src="https://github.com/khui0/flaggle/assets/101839505/405f8fa9-84c1-404f-a02f-fadd559f5f00">

In the example, I chose Seychelles. Now I know the target flag has a red horizontal stripe on top and with a white horizontal stripe in the middle with a star in the middle.

Build a streak by identifying flags and not giving up! **The streak counter will change colors at 10, 50, 100, 250, 500, 1000!**

### Lightning

You're shown the target flag and you have six attempts to identify it.

<img width="802" alt="image" src="https://github.com/khui0/flaggle/assets/101839505/78de92e6-e153-4d9d-9c00-1198ee2e64d0">

### Daily

A new flag is given every day! Same gameplay as **Classic**. Identify the flag in as few attempts as possible and challenge your friends! You can't give up...

Streaks in this mode are counted by the past consecutive days you were able to guess the target flag.

### Tips

You can press tab to insert the first suggestion.

You can search for a country by its two letter ISO code which could be a lot faster than typing out its full name.

## Stats

<img width="36" alt="image" src="https://github.com/khui0/flaggle/assets/101839505/c090f0d0-5fa5-4bc6-b0fe-12360dbea5fc">

View your stats by clicking on the stats button.

<img width="535" alt="image" src="https://github.com/user-attachments/assets/77ba1c74-bf89-452a-a13a-f559ae6f6bda">

## Sources

Flag SVGs, country names, and ISO codes are obtained from [flagpedia.net](https://flagpedia.net/).

## Development

Install dependencies. This will also download and convert all world flags from [flagpedia.net](https://flagpedia.net/).

```bash
npm i
```

Run dev server

```bash
npm run dev
```

## Building

Project will be built to `/dist`

```bash
npm run build
```
