<template>
  <div id="legal-documents-third-schedule">
    <div class="paper-wrapper" id="third-schedule-1">
      <div class="paper legal-document portrait">
        <div class="document-title">
          <div v-for="(item, i) in controller.headerComponents()" :key="i" v-html="item" />
        </div>
        <div class="document-content">
          <div class="document-section">
            <div class="title">
              Chairperson
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.chairperson()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'chairperson') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="document-section">
            <div class="title">
              Notice of meeting
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.noticeOfMeeting()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'noticeOfMeeting') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="document-section">
            <div class="title">
              Methods of holding meetings
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.methodsOfHoldingMeetings()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'methodsOfHoldingMeetings') }}
                </div>
                <div>
                  {{ item }}
                  <ol class="item-list">
                    <li v-for="(method, i) in controller.methodsOfHoldingMeetingsItems()" :key="i">
                      {{ method }}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div class="document-section">
            <div class="title">
              Quorum
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.quorum()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'quorum') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="paper-page-number">
          Page 1 of 3
        </div>
      </div>
    </div>
    <div class="paper-wrapper" id="third-schedule-2">
      <div class="paper legal-document portrait">
        <div class="document-title">
          <div v-for="(item, i) in controller.headerComponents()" :key="i" v-html="item" />
        </div>
        <div class="document-content">
          <div class="document-section">
            <div class="title">
              Voting
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.voting()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'voting') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="document-section">
            <div class="title">
              Minutes
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.minutes()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'minutes') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="document-section">
            <div class="title">
              Resolution passed at adjourned meetings
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.resolutionsPassedAtAdjournedMeetings()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'resolutionsPassedAtAdjournedMeetings') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="document-section">
            <div class="title">
              Resolution in writing
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.resolutionInWriting()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'resolutionInWriting') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="document-section">
            <div class="title">
              Other proceedings
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.otherProceedings()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'otherProceedings') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="paper-page-number">
          Page 2 of 3
        </div>
      </div>
    </div>
    <div class="paper-wrapper" id="third-schedule-3">
      <div class="paper legal-document portrait">
        <div class="document-title">
          <div v-for="(item, i) in controller.headerComponents()" :key="i" v-html="item" />
        </div>
        <div class="document-content">
          <div class="document-section">
            <div class="title">
              Committees of the Board
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.committeesOfTheBoard()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'committeesOfTheBoard') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="document-section">
            <div class="title">
              Managing Directors
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.managingDirectors()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'managingDirectors') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="document-section">
            <div class="title">
              Associate Directors
            </div>
            <div class="content">
              <div class="item" v-for="(item, index) in controller.associateDirectors()" :key="index">
                <div class="item-number">
                  {{ controller.itemNumber(index, 'associateDirectors') }}
                </div>
                <div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="paper-page-number">
          Page 3 of 3
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ThirdScheduleController } from '~/scripts/components/legal-documents/ThirdScheduleController'

const controller = new ThirdScheduleController()
</script>

<style lang="scss">
@use '~/assets/scss/components/LegalDocuments/ThirdSchedule' as *;
</style>