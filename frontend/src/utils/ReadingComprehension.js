const passages = {
    passage1: {
      text: "The sun rises in the east and sets in the west. This is due to the Earth's rotation. Each day, the Earth spins around its axis, causing different parts of the world to experience daylight or darkness.",
      questions: [
        {
          question: "Where does the sun rise?",
          options: ["North", "South", "East", "West"],
          correctAnswer: "East",
        },
        {
          question: "What causes the sun to appear to move across the sky?",
          options: ["The moon's movement", "The Earth's rotation", "The stars", "Clouds"],
          correctAnswer: "The Earth's rotation",
        }
      ],
      image:'gifs/sunrise.gif',
      voice:'sounds/sunrise.mp3'
    },
    passage2: {
      text: "A cheetah is the fastest land animal. It can reach speeds up to 60-70 miles per hour. Cheetahs have adapted to their environment with long legs and a flexible spine, making them excellent hunters.",
      questions: [
        {
          question: "What is the fastest land animal?",
          options: ["Lion", "Tiger", "Cheetah", "Elephant"],
          correctAnswer: "Cheetah",
        },
        {
          question: "How fast can a cheetah run?",
          options: ["30-40 mph", "50-60 mph", "60-70 mph", "80-90 mph"],
          correctAnswer: "60-70 mph",
        }
      ],
      image:'gifs/cheetah.gif',
      voice:'sounds/roar.mp3'
    },
    passage3: {
      text: "Water is essential for life. It makes up about 60% of the human body and is involved in many processes like digestion, temperature regulation, and waste elimination. Without water, a person can survive for only a few days.",
      questions: [
        {
          question: "What percentage of the human body is made up of water?",
          options: ["30%", "50%", "60%", "70%"],
          correctAnswer: "60%",
        },
        {
          question: "How long can a person survive without water?",
          options: ["A few days", "A few weeks", "A month", "A year"],
          correctAnswer: "A few days",
        }
      ],
      image:'gifs/water.gif',
      voice:'sounds/water.mp3'
    },
    passage4: {
      text: "Bees are crucial for pollination. They transfer pollen from one flower to another, helping plants reproduce. Without bees, many of the fruits, vegetables, and nuts we eat would be in short supply, making them vital for the ecosystem and human agriculture.",
      questions: [
        {
          question: "What role do bees play in nature?",
          options: ["They make honey", "They pollinate plants", "They eat pests", "They provide shelter"],
          correctAnswer: "They pollinate plants",
        },
        {
          question: "What would happen without bees?",
          options: ["More flowers would grow", "Less fruits and vegetables would be available", "Animals would grow larger", "Weather would change"],
          correctAnswer: "Less fruits and vegetables would be available",
        }
      ],
      image:'gifs/bees.gif',
      voice:'sounds/bees.mp3'
    }
  };

export default passages;
  