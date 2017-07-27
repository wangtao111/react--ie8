

import React from 'react';
import Component from '../../../../constants/Component';

class LawStatistics extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        text: [],
    };
    this.lawRules = [
      {title:"对于自首而罪行较轻的犯罪分子可以免除处罚",content:'对于犯罪以后自首而罪行较轻的，不仅可以从轻或者减轻处罚，而且还可以免除处罚。犯罪是否较轻，应当根据犯罪的事实、性质、情节和危害后果等加以综合考察、判断。犯罪较轻是可以免除处罚的前提。对“犯罪较轻”，有两种主张：第一种观点主张以法定刑或犯罪性质作为划分较轻之罪和较重之罪的标准；第二种观点主张应以犯罪所应判处的刑罚为标准来划分罪的轻重。因为犯罪的轻和重是一个概括指数，它是对犯罪各方面情况如犯罪情节、犯罪性质、犯罪事实、犯罪对社会的危害性的一个综合评价。因此，犯罪的轻与重，就意味着事实、性质、情节以及社会危害性的轻与重，而犯罪的轻重决定着刑罚的轻重。反过来讲，刑罚的轻重实际表明了罪行的轻重。因此，可以把犯罪分子应当判处的刑罚作为划分较轻之罪和较重之罪的标准。但是，多数人主张应以法定刑轻重作为划分罪的轻重的标准。以多重的法定刑作为区分轻罪和重罪的标准，本法未作明文规定。通常认为，以最低法定刑为三年以上有期徒刑的犯罪，属于较重之罪；反之属于较轻之罪。其理由是：本法第7条规定，我国公民在国外犯罪，按刑法规定的最高刑为三年以上有期徒刑的，可不予追究；从本法第72条关于缓刑的规定看，适用缓刑的对象是犯有较轻罪行，且有悔改表现，适用缓刑确实不致再危害社会的，而适用缓刑的犯罪分子都限于被判处拘役、三年以下有期徒刑之内。这就表明最低法定刑为三年以上有期徒刑的是一种比较重的犯罪。'},
      {title:"对于自首的犯罪分子原则上可以从轻或者减轻处罚",content:"对于自首的犯罪分子，原则上都可以从轻或者减轻处罚，但对于极少数罪行特别严重、情节特别恶劣的犯罪分子，也可以不从轻或者减轻处罚。对于可以从轻或者减轻处罚的自首的犯罪分子，究竟是从轻处罚还是减轻处罚，首先，要分清罪行的轻重；其次，要分析自首的具体情节，如投案早晚、投案动机、客观条件、交代罪行的程度等，在判明了犯罪分子的罪行轻重程度及其悔罪程度之后，区别对待，作出不同的处理。（1）自首的时间。犯罪人犯罪后投案自首的时间早晚，说明犯罪人对自己所犯罪行悔悟的早晚，同时也说明犯罪人的犯罪行为给社会造成危害的持续状态的长短以及由此给社会造成的危害大小。（2）自首的原因与动机。犯罪人犯罪之后的认罪、悔罪、悔改心理是自首动机的三个层次。悔罪程度的不同，表明了自首犯对所犯罪行悔罪程度的差异。悔罪态度好，改造起来就容易，悔罪态度差，改造起来就难，这些因素也是量刑时所要考虑的。犯罪人犯罪之后，是在走投无路的情况下投案自首，还是自动投案自首，也说明自首人对自己的所犯罪行悔悟的程度，量刑时也要予以考虑。（3）交待罪行的情况。犯罪人投案之后，交代罪行是否彻底、主动也影响量刑，交待罪行的程度不同，说明了犯罪人是真心悔悟还是想蒙混过关，量刑时也须考虑。（4）犯罪人是否有立功表现。"},
      {title:"成立一般自首，必须是基于犯罪分子本人的意志而自动投案",content:"自动投案的动机，必须是基于犯罪分子本人的意志而自动投案。换言之，犯罪分子的投案，并不是由于违背其本意的原因所致。犯罪分子自动投案的动机是多种多样的，有的出于真诚悔罪，有的慑于法律的威严，有的为了争取宽大处理，有的潜逃在外生活无着，有的经亲友规劝而醒悟，等等，不同的动机并不影响投案行为的自动性。司法实践中时常出现的送子女或亲友归案的情况，一般并非出于犯罪分子的主动，而是经家长、亲友规劝，陪同投案的。无论是公安机关通知犯罪分子的家长、亲友后，或者家长、亲友主动报案的，将犯罪分子送去投案的，都应当视为自动投案。"}
    ];
  }

  componentWillMount = () => {
    let text = [];
    for (let i = 0; i < this.lawRules.length; i++) {
      text.push({textHidden: false});
    }
    text[0].textHidden = true;
    this.setState({text});
  };
  changeText = (index) => {
    let text = this.state.text;
    text[index].textHidden = !text[index].textHidden;
    this.setState({text});
    console.log("11111111111",index,this.state.text)
  };
  render() {
    return (<div className="pane">
          {
            this.state.text[0] ?
            this.lawRules.map((msg, index) =>
              <div className="faxin" key={index}>
                <i></i>
                <p>{msg.title}</p>
                <div style={ !this.state.text[index].textHidden ? { height:'106px'} : { height: 'auto' } }>{msg.content}</div>
                <b onClick={this.changeText.bind(this, index)}>{ !this.state.text[index].textHidden ? '. . .':'收起 >' }</b>
              </div>
            )
              : null
          }
          {/*<div className="predict_pane">*/}
          {/*</div>*/}
      </div>);
  }
}
LawStatistics.propTypes = {
  similarCase: React.PropTypes.object.isRequired
};
export default LawStatistics;
