export type Dish = { name: string; description?: string; price?: string };
export type MenuSection = { title: string; note?: string; dishes: Dish[]; featured?: boolean };
export type Menu = {
  id: string;
  label: string;
  title: string;
  price?: string;
  intro?: string;
  pdf?: string;
  columns?: { title: string; price: string; sections: MenuSection[] }[];
  sections: MenuSection[];
};

export const dietary =
  "Please ask a member of our team before ordering if you have any allergies or intolerances. Nuts and flour are used in our kitchen, and despite our efforts to prevent cross-contamination, our dishes may contain traces of allergens. A discretionary service charge of 12.5% will be added to your bill. VAT included.";

export const menus: Menu[] = [
  {
    id: "a-la-carte",
    label: "A La Carte",
    title: "A La Carte",
    intro:
      "Our chef has crafted a unique Mediterranean menu with ingredients and flavours from the Mediterranean coast. Using timeless cooking techniques and authentic flavours, all served with a modern twist.",
    pdf: "/menus/a-la-carte.pdf",
    sections: [
      {
        title: "Starters",
        dishes: [
          { name: "Olives", description: "Dried apricots and lemon oil (VG)", price: "5" },
          { name: "Bread basket", description: "Herb butter (V)", price: "5.5" },
          { name: "Atom", description: "Yogurt, hint of garlic, fresh chilli, smoked paprika, sesame, olive oil", price: "9" },
          { name: "Hummus", description: "Dried black olive flakes, sesame seeds (VG)", price: "9.5" },
          { name: "Tabbouleh", description: "Parsley, mint, crushed wheat, tomatoes, spring onions and lemon (VG)", price: "8" },
          { name: "Babaganoush", description: "Grilled aubergine, yogurt, tahini, garlic and lemon (V)", price: "9.5" },
          { name: "Antep ezme", description: "Chopped tomatoes, onions and chilli pepper salad (VG)", price: "8.5" },
          { name: "Cacik", description: "Yogurt, cucumber, mint and dill (V)", price: "8.5" },
          { name: "Burrata", description: "Heirloom tomatoes (V)", price: "13" },
          { name: "Turkish aubergine shakshuka", description: "Served on yogurt (V)", price: "9.5" },
          { name: "Charcoal grilled halloumi", description: "(V)", price: "10" },
          { name: "Sucuk", description: "Grilled spicy beef sausage", price: "8.5" },
          { name: "Manchego croquetas", description: "3 pcs, chilli jam (V)", price: "9.5" },
          { name: "Fried baby calamari", description: "Lime mayo", price: "11.5" },
          { name: "Octopus a feira", description: "Low cooked Galician octopus with confit potatoes and smoked paprika", price: "17.5" },
          { name: "Smoked salmon", description: "Pickled cucumber, garlic yogurt, salmon roe, cucumber sauce", price: "11.5" },
          { name: "Cast iron prawns", description: "Oyster, chestnut & button mushrooms, confit garlic", price: "13" },
          { name: "Falafel", description: "Fritters of crushed chickpeas, fava beans and peppers (VG)", price: "8.5" },
          { name: "Lambs liver", description: "Sautéed lambs liver in butter sauce, red onions, sumac", price: "11" },
          { name: "Cheese plate", description: "Manchego, St Nectaire, parmesan, blue cheese, with grapes, walnuts, olive oil torta and quince chutney (V)", price: "15.5" },
        ],
      },
      {
        title: "Fish & Seafood",
        dishes: [
          { name: "Seabream fillet", description: "Sautéed diced aubergine, cherry tomatoes, asparagus, shallots and white wine", price: "26" },
          { name: "Grilled monkfish shish", description: "Garlic & yogurt marinade, preserved lemon, saffron rice, romesco sauce, grilled courgette", price: "29" },
          { name: "Grilled salmon", description: "Salmon fillet, smoky piperade, confit baby potatoes", price: "27" },
          { name: "Grilled tiger prawn", description: "Red pepper, carrot sauce with chickpeas and spinach", price: "28" },
          { name: "Prawn and Cornish crab spaghetti", description: "Sautéed prawns, Cornish white crab meat, garlic, chilli, parsley", price: "27" },
        ],
      },
      {
        title: "Vegetarian & Vegan",
        dishes: [
          { name: "Grilled confit artichoke", description: "Seared polenta, mustard, baby carrots, orange (VG)", price: "20" },
          { name: "Chargrilled cauliflower", description: "Carrot and orange purée, garlic flakes, dried olives (VG)", price: "22" },
          { name: "Vegetable moussaka", description: "Layers of aubergine, courgette, potatoes and peppers topped with béchamel and cheese gratin, served with cacik (V)", price: "22" },
        ],
      },
      {
        title: "Salads",
        dishes: [
          { name: "Fresh mixed salad", description: "Baby spinach, green apple, oak lettuce, Tulum cheese and cherry tomatoes (vegan option available) (V)", price: "17" },
          { name: "Chicken salad", description: "Grilled chicken, baby spinach, green apple, oak lettuce and cherry tomatoes", price: "24" },
          { name: "Salmon salad", description: "Grilled salmon, baby spinach, green apple, oak lettuce and cherry tomatoes", price: "26" },
        ],
      },
      {
        title: "Meat",
        dishes: [
          { name: "Lamb kofte skewer", description: "Yogurt, crispy bread, grilled pepper and tomato", price: "26" },
          { name: "Chicken shish", description: "Grilled asparagus and courgettes with sumac, cacik and lavash bread", price: "25" },
          { name: "Chicken tagine", description: "Braised chicken, spice-infused sauce, prunes, dried apricots, almonds, with rice", price: "24" },
          { name: "Lamb shish", description: "Grilled asparagus and courgettes with sumac, grilled pepper and ezme salad", price: "27" },
          { name: "Mixed grill", description: "Grilled cubes of chicken, lamb and kofte with grilled asparagus and courgette, ezme salad", price: "27.5" },
          { name: "Lamb chops", description: "3 pcs, with fennel salad", price: "28.5" },
          { name: "Minced meat moussaka", description: "Served with cacik", price: "26" },
          { name: "Incik lamb shank", description: "Slow cooked lamb shank with onions, peppers and bulgur rice", price: "28" },
        ],
      },
      {
        title: "Signature Steaks",
        featured: true,
        dishes: [
          { name: "Australian Wagyu rib-eye 350g", description: "Marble score 6–7. Rocket and shaved parmesan salad, sautéed spiced potatoes, chimichurri", price: "65" },
          { name: "Australian Black Angus sirloin 280g", description: "Sautéed spiced potatoes, peppercorn sauce", price: "37" },
          { name: "Black Angus rib-eye 280g", description: "Sautéed spiced potatoes, chimichurri", price: "43" },
        ],
      },
      {
        title: "Stone Oven-Baked Pide",
        note: "Anatolian pizza",
        dishes: [
          { name: "Spinach, feta and chilli flakes", description: "(V)", price: "17.5" },
          { name: "Mushroom and taleggio", description: "(V)", price: "17.5" },
          { name: "Beef pepperoni and mozzarella", price: "17.5" },
          { name: "Minced lamb and vegetables", price: "17.5" },
        ],
      },
      {
        title: "Sides",
        dishes: [
          { name: "Samphire", description: "Pine nuts and garlic oil (VG)", price: "8.5" },
          { name: "Spiced new potatoes", description: "Parsley (V)", price: "7" },
          { name: "Chips", description: "Spicy mayo (V)", price: "6" },
          { name: "Basmati rice", description: "(VG)", price: "5" },
          { name: "Bulgur rice", description: "(VG)", price: "5" },
          { name: "Saffron rice", description: "(VG)", price: "7" },
          { name: "Fresh mixed salad", description: "(VG)", price: "7" },
          { name: "Grilled asparagus and courgettes", description: "Crispy garlic (VG)", price: "6" },
        ],
      },
    ],
  },
  {
    id: "set-lunch",
    label: "Set Lunch",
    title: "Lunch Menu",
    price: "£19.50 per person",
    pdf: "/menus/lunch.pdf",
    sections: [
      {
        title: "A choice of starter",
        dishes: [
          { name: "Tabbouleh", description: "Parsley, mint, crushed wheat, tomatoes, spring onions and lemon (VG)" },
          { name: "Babaganoush", description: "Grilled aubergine, yogurt, tahini, garlic and lemon (V)" },
          { name: "Hummus", description: "Dried black olive flakes, sesame seeds (V)" },
        ],
      },
      {
        title: "A choice of main",
        dishes: [
          { name: "Flat bread (pide)", description: "Minced beef and vegetables" },
          { name: "Chicken tagine", description: "Braised chicken, spice-infused sauce, prunes, dried apricots, almonds, with rice" },
          { name: "Vegetable moussaka", description: "Layers of aubergine, courgette, potatoes and peppers topped with béchamel and cheese gratin, served with cacik" },
        ],
      },
    ],
  },
  {
    id: "meze-lunch",
    label: "Meze Lunch",
    title: "Meze Lunch",
    pdf: "/menus/lunch.pdf",
    sections: [
      {
        title: "To share",
        note: "Vegetarian option available",
        dishes: [
          { name: "Hummus (VG)", description: "Chickpeas, tahini, olive oil, garlic and lemon" },
          { name: "Tabbouleh (VG)", description: "Parsley, mint, crushed wheat, tomatoes, spring onions and lemon" },
          { name: "Babaganoush (V)", description: "Grilled aubergine, yogurt, tahini, garlic and lemon" },
          { name: "Falafel (VG)", description: "Fritters of crushed chickpeas, fava beans and pepper" },
          { name: "Cacik (V)", description: "Yoghurt, cucumber, mint and dill" },
          { name: "Turkish aubergine shakshuka", description: "Served on yoghurt" },
          { name: "Hellim", description: "Grilled Cypriot cheese" },
          { name: "Lamb kofte", description: "Grilled spiced minced lamb" },
        ],
      },
    ],
  },
  {
    id: "pre-theatre",
    label: "Pre-Theatre",
    title: "Pre-Theatre Menu",
    price: "£29.50 per person",
    pdf: "/menus/pre-theatre.pdf",
    sections: [
      {
        title: "A choice of starter",
        dishes: [
          { name: "Babaganoush", description: "Grilled aubergine, yogurt, tahini, garlic and lemon (V)" },
          { name: "Smoked salmon", description: "Pickled cucumber, garlic yogurt, salmon roe, cucumber sauce" },
          { name: "Falafel", description: "Fritters of crushed chickpeas, fava beans and peppers" },
          { name: "Hummus", description: "Dried black olive flakes, sesame seeds (V)" },
        ],
      },
      {
        title: "A choice of main",
        dishes: [
          { name: "Chicken shish", description: "Grilled asparagus and courgette with sumac, cacik and lavash bread" },
          { name: "Chargrilled cauliflower", description: "Carrot and orange purée, garlic flakes, dried olives (VG)" },
          { name: "Minced meat moussaka", description: "Served with cacik" },
          { name: "Seabream fillet", description: "Sautéed diced aubergine, cherry tomatoes, asparagus, shallots and white wine" },
        ],
      },
    ],
  },
  {
    id: "christmas",
    label: "Christmas",
    title: "Christmas Menu",
    intro: "Two festive set menus of sharing starters, a main course and dessert.",
    pdf: "/menus/christmas-2026.pdf",
    sections: [],
    columns: [
      {
        title: "Menu 1",
        price: "£52",
        sections: [
          {
            title: "Sharing starters",
            dishes: [
              { name: "Hummus (vg)", description: "Purée of chickpeas with tahini, garlic" },
              { name: "Tabbouleh (vg)", description: "Finely chopped parsley, spring onions, mint, crushed wheat, tomatoes and lemon" },
              { name: "Babaganoush (v)", description: "Grilled aubergine, yoghurt, tahini, garlic & lemon" },
              { name: "Falafel (vg)", description: "Fritters of crushed chickpeas, fava beans and peppers" },
              { name: "Cacik (v)", description: "Yoghurt, cucumber, mint, confit garlic and dill" },
            ],
          },
          {
            title: "Choice of main course",
            dishes: [
              { name: "Lamb kofte", description: "Lamb kofte skewers, yogurt, crispy bread, grilled pepper and tomato" },
              { name: "Chicken shish", description: "Grilled asparagus and courgettes with sumac, cacik and lavash bread" },
              { name: "Meat moussaka", description: "Minced lamb moussaka served with cacik" },
              { name: "Grilled salmon", description: "Salmon fillet, smoky piperade, confit baby potatoes" },
              { name: "Grilled confit artichoke (vg)", description: "Seared polenta, mustard, baby carrots, orange segments" },
            ],
          },
          {
            title: "Dessert",
            dishes: [{ name: "Chocolate brownie (v)", description: "Vanilla ice cream" }],
          },
        ],
      },
      {
        title: "Menu 2",
        price: "£62",
        sections: [
          {
            title: "Sharing starters",
            dishes: [
              { name: "Bread basket with focaccia (v)" },
              { name: "Hummus (vg)", description: "Purée of chickpeas with tahini, garlic" },
              { name: "Manchego croquetas (v)", description: "Chilli jam" },
              { name: "Babaganoush (v)", description: "Grilled aubergine, yoghurt, tahini, garlic & lemon" },
              { name: "Calamari", description: "Fried baby calamari served with lime mayo" },
              { name: "Falafel (vg)", description: "Fritters of crushed chickpeas, fava beans and peppers" },
              { name: "Tabbouleh (vg)", description: "Finely chopped parsley, spring onions, mint, crushed wheat, pomegranate, tomatoes and lemon" },
              { name: "Shakshuka (v)", description: "Turkish aubergine shakshuka served with yoghurt" },
            ],
          },
          {
            title: "Choice of main course",
            dishes: [
              { name: "Mixed grill", description: "Grilled cubes of chicken, lamb and kofte, grilled asparagus, courgettes with ezme salad" },
              { name: "Black Angus sirloin", description: "Chargrilled, peppercorn sauce, sautéed spiced potatoes" },
              { name: "Vegetable moussaka (v)", description: "Layers of aubergine, courgettes, potatoes and peppers topped with béchamel and cheese gratin" },
              { name: "Grilled monkfish", description: "Garlic & yogurt marinade, preserved lemon, saffron rice, romesco sauce, grilled courgette" },
              { name: "Lamb shank", description: "Slow cooked with onions, peppers and bulgur rice" },
              { name: "Chicken shish", description: "Grilled cubes of marinated chicken breast with grilled asparagus and courgettes" },
            ],
          },
          {
            title: "Choice of dessert",
            dishes: [
              { name: "Basque country cheesecake (v)" },
              { name: "Chocolate brownie (v)", description: "Vanilla ice cream" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    title: "Kids Menu",
    pdf: "/menus/kids.pdf",
    sections: [
      {
        title: "Mains",
        dishes: [
          { name: "Spaghetti Bolognese", description: "Spaghetti topped with a rich, slow-cooked meat sauce and finished with Parmesan", price: "8" },
          { name: "Olea Burger", description: "A juicy beef patty served in a soft bun with lettuce and tomato. Alternatively, it can be served plain", price: "9" },
          { name: "Grilled Chicken Shish", description: "Charcoal grilled marinated chicken cubes served with chips", price: "11.5" },
          { name: "Lamb Kofte", description: "Charcoal grilled mild spiced minced lamb served with chips", price: "11.5" },
          { name: "Beef Pepperoni Pide/Flat Bread", description: "Stone oven baked pide/flat bread topped with pepperoni and cheddar", price: "11.5" },
        ],
      },
    ],
  },
];
