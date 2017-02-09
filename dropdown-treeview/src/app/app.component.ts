import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  items = {
    name: "root",
    children: [
      {
        name: "europe",

        children: [
          {
            name: "spain",

            children: [
              {
                name: "realmadrid",

                children: [
                  {
                    name: "ronaldo"
                  }
                ]
              },
              {
                name: "barcelona",

                children: [
                  {
                    name: "messi"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "england",

        children: [
          {
            name: "unknown english",

          },
          {
            name: "liverpool",

            children: [
              {
                name: "gerald",

              }
            ]
          }
        ]
      }
    ]
  };
}
