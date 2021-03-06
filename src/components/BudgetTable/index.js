import BudgetModals from 'components/BudgetModals'
import { useAllBudgets, useLocale } from 'hooks'
import { MDBDataTable } from 'mdbreact'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Row } from 'reactstrap'
import { getYearMonthDayString } from 'utils'

const BudgetTable = props => {
    const { t } = useTranslation()
    const { budgets } = props
    const { refetchAllBudgetData, setRefetchAllBudgetData } = useAllBudgets()
    const { locale, currency } = useLocale()

    const [modalInfo, setModalInfo] = useState()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)

    const toggleCreateModal = () => {
        setCreateModal(!createModal)
        setRefetchAllBudgetData(refetchAllBudgetData + 1)
    }

    const toggleEditModal = () => {
        setEditModal(!editModal)
        setShowConfirmation(false)
        setRefetchAllBudgetData(refetchAllBudgetData + 1)
    }

    const rows = []
    budgets.map(budget => {
        const row = {}
        row.clickEvent = () => {
            setModalInfo(budget)
            toggleEditModal()
        }
        row.name = budget.name
        row.amount = budget.amount.toLocaleString(locale, {
            style: 'currency',
            currency,
        })
        row.startDate = getYearMonthDayString(new Date(budget.startDate))
        row.endDate = budget.endDate
            ? getYearMonthDayString(new Date(budget.endDate))
            : null
        row.showInMenu = budget.showInMenu ? 'Yes' : 'No'
        row.sortOrder = budget.sortOrder
        row.action = (
            <>
                <Button
                    type="button"
                    color="primary"
                    className="btn-sm btn-rounded"
                    onClick={toggleEditModal}
                >
                    {t('Edit Budget')}
                </Button>
            </>
        )
        rows.push(row)
    })
    rows.sort((a, b) => a.sortOrder > b.sortOrder)

    const data = {
        columns: [
            {
                field: 'name',
                label: t('Name'),
            },
            {
                field: 'amount',
                label: t('Amount'),
            },
            {
                field: 'startDate',
                label: t('Start Date'),
            },
            {
                field: 'endDate',
                label: t('End Date'),
            },
            {
                field: 'showInMenu',
                label: t('Show in Top Menu?'),
            },
            {
                field: 'sortOrder',
                label: t('Sort Order'),
            },
            {
                field: 'action',
                label: t('Action'),
                sort: 'disabled',
            },
        ],
        rows,
    }

    return (
        <React.Fragment>
            <BudgetModals
                budgets={budgets}
                modalInfo={modalInfo}
                createModal={createModal}
                toggleCreateModal={toggleCreateModal}
                editModal={editModal}
                toggleEditModal={toggleEditModal}
                showConfirmation={showConfirmation}
                setShowConfirmation={setShowConfirmation}
            />
            <Row className="mb-2">
                <Col xl="12">
                    <div className="text-sm-right float-right">
                        <Button
                            type="button"
                            color="success"
                            className="btn-rounded waves-effect waves-light float-right"
                            onClick={toggleCreateModal}
                        >
                            <i className="mdi mdi-plus mr-1" />
                            {t('Add New Budget')}
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xl="12">
                    <div className="table-responsive">
                        <MDBDataTable
                            data={data}
                            searchLabel={t('Search')}
                            paginationLabel={[t('Previous'), t('Next')]}
                            infoLabel={[
                                t('Showing'),
                                t('to'),
                                t('of'),
                                t('entries'),
                            ]}
                            entries={25}
                            entriesOptions={[10, 25, 50, 100]}
                            entriesLabel={false}
                            noRecordsFoundLabel={t('No budgets found')}
                            noBottomColumns
                            responsive
                            hover
                        />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}

BudgetTable.propTypes = {
    budgets: PropTypes.object,
    modalInfo: PropTypes.object,
}

export default BudgetTable
