// import Router from '@koa/router'
// import axios from 'axios'
// import User from '../../models/User'
// import logger from '../../modules/logger'
// import FormData from 'form-data'
// import { getSlackProfile } from '../../modules/slack'
// import { acceptEvent, rejectEvent } from '../../modules/events'
// import { getEventById } from '../../modules/google'
// const router = new Router()
// router.get('/callback', async ctx => {
//   const { code, state } = ctx.request.query
//   try {
//     if (!code) {
//       return ctx.redirect('https://app.karine.team')
//     }
//     const formData = new FormData()
//     formData.append('code', code)
//     formData.append('client_id', process.env.SLACK_CLIENT_ID)
//     formData.append('client_secret', process.env.SLACK_CLIENT_SECRET)
//     formData.append(
//       'redirect_uri',
//       process.env.SLACK_REDIRECT_URL + '/v1/integrations/slack/callback'
//     )
//     const response = await axios.post(
//       'https://slack.com/api/oauth.v2.access',
//       formData.getBuffer(),
//       {
//         headers: formData.getHeaders(),
//       }
//     )
//     if (response.data.access_token) {
//       let user
//       if (state) {
//         user = await User.findOne({
//           _id: state,
//         })
//       }
//       if (!user) {
//         const slackUserProfile = await getSlackProfile(
//           response.data.authed_user.access_token
//         )
//         if (!slackUserProfile || !slackUserProfile.profile) throw 404
//         user = await User.findOne({
//           email: slackUserProfile.profile.email,
//         })
//         if (!user) {
//           user = new User({
//             email: slackUserProfile.profile.email,
//             firstName: slackUserProfile.profile.real_name,
//             lastName: slackUserProfile.profile.real_name,
//             locale: 'en',
//           })
//           if (!user.slack) {
//             user.slack.authed_user_id = ''
//             user.slack.authed_user_token = ''
//             user.slack.access_token = ''
//             user.slack.scope = ''
//             user.slack.id = ''
//             user.slack.teamId = ''
//             user.slack.teamName = ''
//             user.slack.appId = ''
//           }
//         }
//       }
//       user.slack.authed_user_id = response.data.authed_user.id
//       user.slack.authed_user_token = response.data.authed_user.access_token
//       user.slack.access_token = response.data.access_token
//       user.slack.scope = response.data.scope
//       user.slack.id = response.data.authed_user.id
//       user.slack.teamId = response.data.team.id
//       user.slack.teamName = response.data.team.name
//       user.slack.appId = response.data.app_id
//       await user.save()
//       user = await User.findOne({
//         email: user.email,
//       })
//     }
//     return ctx.redirect('https://app.karine.team')
//   } catch (err) {
//     if (err.response && err.response.status) {
//       logger.error(
//         'Error in slack callback Query: ' +
//           JSON.stringify(ctx.request.query) +
//           'Status:' +
//           err.response.status +
//           ' / Data:' +
//           JSON.stringify(err.response.data)
//       )
//     } else {
//       logger.error(err)
//     }
//     return ctx.redirect('https://app.karine.team')
//   }
// })
// router.post('/interactions', async ctx => {
//   const slackRequest = JSON.parse(ctx.request.body.payload)
//   const action = slackRequest.actions[0]
//   const isAccepting = action.style === 'primary'
//   const newBlocks = slackRequest.message.blocks.filter(
//     e => e.type !== 'actions'
//   )
//   newBlocks.push(
//     isAccepting
//       ? {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: 'Accepted',
//           },
//         }
//       : {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: 'Rejected',
//           },
//         }
//   )
//   const me = await User.findOne({
//     'slack.authed_user_id': slackRequest.user.id,
//   })
//   const event = await getEventById(action.value, me)
//   if (isAccepting) {
//     await acceptEvent(event, me, false)
//   } else {
//     await rejectEvent(event, me, false)
//   }
//   axios
//     .post(slackRequest.response_url, {
//       replace_original: 'true',
//       blocks: newBlocks,
//     })
//     .catch(console.error)
//   ctx.status = 200
// })
// export default router
