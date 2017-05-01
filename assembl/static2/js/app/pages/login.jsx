import React from 'react';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import get from 'lodash/get';
import { I18n } from 'react-redux-i18n';
import AsLogin from '../components/login/assemblLogin';
import { SocialMedia } from '../components/login/socialMediaLogin';
import { getProvidersData } from '../utils/globalFunctions';
import { displayAlert } from '../utils/utilityManager';

class Login extends React.Component {
  componentDidMount(){
    let error = get(this.props, 'location.query.error', null);
    error = (error && typeof error === 'string') ? parseInt(error) : error;
    let msg;
    if (error) {
      switch(error) {
        case 404: {
          msg = I18n.t('login.emailNotFound');
          displayAlert('danger', msg, true);
          break;
        }
        case 422: {
          msg = I18n.t('login.incorrectPasswordLogin');
          displayAlert('danger', msg, true);
          break;
        }
        default: {
          msg = I18n.t('login.somethingWentWrong');
          displayAlert('danger', msg, true);
        }
      }
    }
  }

  render() {
    const { debateData } = this.props.debate;
    const providers = getProvidersData();
    const next = get(this.props, 'location.query.next', null);
    const isSocialMedias = providers && providers.length > 0;
    return (
      <Grid fluid className="login-grid">
        <Col xs={12} sm={isSocialMedias ? 9 : 6} lg={isSocialMedias ? 7 : 4} className="login-container col-centered">
          <div className="box-title">{debateData ? debateData.topic : I18n.t('login.login')}</div>
          <div className="box">
            {isSocialMedias &&
              <div>
                <Col xs={12} md={5}>
                  <SocialMedia providers={providers} />
                </Col>
                <Col xs={12} md={1}>&nbsp;</Col>
              </div>
            }
            <Col xs={12} md={isSocialMedias ? 6 : 12}>
              {debateData ? <AsLogin next={next} slug={debateData.slug} /> : <AsLogin next={next} />}
            </Col>
            <div className="clear">&nbsp;</div>
          </div>
        </Col>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    debate: state.debate
  };
};

export default connect(mapStateToProps)(Login);