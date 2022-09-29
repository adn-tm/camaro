const fs = require('fs')
const t = require('tape')
const { transform } = require('../')

t.test('datetime test', async (t) => {
    const DATES= {
        longJoined: {v: "20220530103030-0500", e: "2022-05-30T10:30:30-0500"},
        longJoinedTz: {v: "20220530103030-04", e: "2022-05-30T10:30:30-04"},
        longJoinedPos: {v: "20220530103030+0500", e: "2022-05-30T10:30:30+0500"},
        longJoinedTzPos: {v: "20220530103030+04", e: "2022-05-30T10:30:30+04"},
        longSplitted: {v: "2022-06-30T10:30:30-0500", e: "2022-06-30T10:30:30-0500"},
        longSplittedSpaced: {v: "2022-07-30 10:30:30Z", e: "2022-07-30T10:30:30+0000"},
        longSplittedUTC: {v: "20220630T103030 UTC", e: "2022-06-30T10:30:30 UTC"},
        longTSplitted: {v: "2022-07-30T10:30:30Z", e: "2022-07-30T10:30:30+0000"},
        longSpacedWoZone: {v: "2022-07-30 10:30:30", e: "2022-07-30T10:30:30+0000"},
        longTSpacedWoZone: {v: "2022-07-30T10:30:30", e: "2022-07-30T10:30:30+0000"},
        dateSplitted: {v: "2022-08-30", e: "2022-08-30T00:00:00+0000"},
        dateJoined: {v: "20220913", e: "2022-09-13T00:00:00+0000"},
        YMJoined: {v: "202203", e: "2022-03-01T00:00:00+0000"},
        YMSplitted: {v: "2022-03", e: "2022-03-01T00:00:00+0000"},
        year: {v: "2021", e: "2021-01-01T00:00:00+0000"}
    }
    const xml = "<DatesList>\n"+
            Object.keys(DATES).map(a=>`<${a}_dt>${DATES[a].v}</${a}_dt>`).join("\n")+
            Object.keys(DATES).map(a=>`<${a}_d>${DATES[a].v}</${a}_d>`).join("\n")+
            Object.keys(DATES).map(a=>`<${a}_t>${DATES[a].v}</${a}_t>`).join("\n")+
        "</DatesList>";
    const template = {};
    for(let v in DATES) {
        template[v+"_dt"]=`datetime(/DatesList/${v}_dt)`;
        template[v+"_d"]=`date(/DatesList/${v}_d)`;
        template[v+"_t"]=`time(/DatesList/${v}_t)`;
    }
    const result = await transform(xml, template)
    console.log("==================================", xml);
    console.log("==================================", template);
    console.log("==================================", result);
    for(let v in DATES) {
        t.equal(result[v+"_dt"],  DATES[v].e, `datetime(${DATES[v].v}) => ${DATES[v].e}`);
        t.equal(result[v+"_d"],  DATES[v].e.substring(0, 10), `date(${DATES[v].v}) => ${DATES[v].e}`);
        t.equal(result[v+"_t"],  DATES[v].e.substring(11), `time(${DATES[v].v}) => ${DATES[v].e}`);
    }
    t.end()
})
