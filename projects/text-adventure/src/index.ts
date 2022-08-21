// secondary players are "directors"
// 2 directors can vote for their own choices
// 3+ directors must vote for someone else's choice

import { pickRandom } from 'botman-utils';

interface Choice {
  text: string;
  next: Array<string | StageTemplate>;
}

interface StageTemplateOptions {
  text: string;
  choices: Array<string | Choice>;
}

class StageTemplate {
  text: string;
  textParts: string[];
  choices: Array<string | Choice>;

  constructor(options: StageTemplateOptions) {
    this.text = options.text;
    this.textParts = options.text.split(/{.*}/);
    this.choices = options.choices;
  }
}

interface StageOptions {
  template: StageTemplate;
}

class Stage {
  template: StageTemplate;

  constructor(options: StageOptions) {
    this.template = options.template;
  }
}

const startStages = [
  new Stage({
    template: new StageTemplate({
      text: 'You come across a sus looking { setting }',
      choices: ['You are drawn inexorably towards the { setting }'],
    }),
  }),
  new Stage({
    template: new StageTemplate({
      text: 'You spot a giant { setting } in the distance',
      choices: ['You are drawn inexorably towards the { setting }'],
    }),
  }),
  new Stage({
    template: new StageTemplate({
      text: 'Upon the distant horizon, you spot a looming { setting }',
      choices: ['You are drawn inexorably towards the { setting }'],
    }),
  }),
];

const approachStages = [
  new Stage({
    template: new StageTemplate({
      text: 'As you approach the { setting }, you notice that it is in fact { %0 }',
      choices: [
        'You proceed inside, obviously',
        'Choice is an illusion, you proceed inside',
      ],
    }),
  }),
  new Stage({
    template: new StageTemplate({
      text: 'Approaching the { setting }, you observe a slimy-looking { %0 } on { %1 }',
      choices: [
        'Ignoring the { %0 }, you proceed inside',
        'Choice is an illusion, you proceed inside',
      ],
    }),
  }),
];

const crossroadsStages = [
  new Stage({
    template: new StageTemplate({
      text: 'You enter a room with 3 doors, you hear the distant sound of { %0 } from the first door, a rhythmic { %1 } from the second, and the smell of { %2 } wafts from the third',
      choices: [
        'You choose the first door',
        'You choose the second door',
        {
          text: 'You choose the third door, despite the { %2 } smell, though you must admit it is starting to grow on you',
          next: [
            'The pungent aroma of { %^2 } grows stronger as you proceed',
            new StageTemplate({
              text: 'Emerging into a large, dimly lit room, you find yourself face to face with { a | an } { %0 }. This is undoubtedly the source of the { %^2 } aroma',
              choices: [{
                text: 'Kill it with fire',
                next: [
                  new StageTemplate({
                    text: 'You have no fire',
                    choices: [{
                      text: 'Fuck',
                      next: ['You run from the room as fast as possible'],
                    }],
                  }),
                ],
              }, {
                text: 'Ask the { %^0 } where you can find the treasure',
                next: [
                  'The { %^0 } stares at you but does not answer',
                  'You leave the room through a door other than the one you came from, and leave the { %^0 } and its { %^^2 } aroma in peace',
                ],
              }],
            }),
          ],
        },
      ],
    }),
  }),
  new Stage({
    template: new StageTemplate({
      text: 'You enter a room with 2 doors, a crude { %0 } is carved into the first, and an obscene, yet tasteful, rendition of { %1 } into the second',
      choices: [
        'You choose the { %0 } door',
        'You choose the { %1 } door',
      ],
    }),
  }),
  new Stage({
    template: new StageTemplate({
      text: 'You enter a room with 15 doors, and I\'m sure as fuck not describing them all, so just close your eyes and pick one, thanks. Oh and there\'s a { %0 } watching you from above, but you haven\'t noticed it',
      choices: [
        'You stagger somewhere off to the left',
        'Your monkey brain takes over and you charge blindly forward',
        'You ask your pet rock which door to pick, but it offers no answer, it\'s a rock, moron. You wander somewhere vaguely to the right, the stupidest direction',
      ],
    }),
  }),
  new Stage({
    template: new StageTemplate({
      text: 'You step into a round chamber with no obvious doors or windows',
      choices: [
        'Okay',
        'You put on your robe and wizard hat',
      ],
    }),
  }),
];
