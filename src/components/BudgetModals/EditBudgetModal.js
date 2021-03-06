/* eslint-disable no-undef */
import { useAuth0 } from '@auth0/auth0-react'
import { AvForm, AvInput } from 'availity-reactstrap-validation'
import { config } from 'config'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from 'reactstrap'
import { showToast } from 'utils'

const getSaveQuery = variables => {
    return {
        query: `
            mutation updateBudget(
                $id: String!
                $name: String!
                $amount: Float!
                $startDate: DateTime!
                $endDate: DateTime
                $showInMenu: Boolean!
                $sortOrder: Float!
            ) {
                updateBudget(
                    id: $id
                    name: $name
                    amount: $amount
                    startDate: $startDate
                    endDate: $endDate
                    showInMenu: $showInMenu
                    sortOrder: $sortOrder
                ) {
                    _id
                    name
                    amount
                    showInMenu
                }
            }
        `,
        variables,
    }
}

const getDeleteQuery = variables => {
    return {
        query: `
            mutation deleteBudget($id: String!) {
                deleteBudget(id: $id) {
                    _id
                    name
                    amount
                    showInMenu
                }
            }
        `,
        variables,
    }
}

const getFormattedDate = date => {
    return new Date(date.getTime()).toISOString().substr(0, 10)
}

const EditBudgetModal = props => {
    const {
        isOpen,
        toggle,
        budget,
        showConfirmation,
        setShowConfirmation,
    } = props
    const { t } = useTranslation()
    const [showInMenu, setShowInMenu] = useState(false)
    const { getAccessTokenSilently } = useAuth0()

    const toggleState = budget?.showInMenu ? budget.showInMenu : false

    useEffect(() => {
        setShowInMenu(toggleState)
    }, [toggleState])

    const updateBudget = async variables => {
        const token = await getAccessTokenSilently()
        const query = getSaveQuery(variables)
        const response = await fetch(config.backend.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(query),
        })
        const result = await response.json()
        if (result.errors) {
            showToast('error', result.errors[0].message)
        } else {
            showToast('success', t('Budget updated!'))
        }
    }

    const deleteBudget = async variables => {
        const token = await getAccessTokenSilently()
        const query = getDeleteQuery(variables)
        const response = await fetch(config.backend.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(query),
        })
        const result = await response.json()
        if (result.errors) {
            showToast('error', result.errors[0].message)
        } else {
            showToast('success', t('Budget deleted!'))
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            role="dialog"
            autoFocus={true}
            centered={true}
            className="exampleModal"
            tabIndex="-1"
            toggle={toggle}
        >
            {budget && (
                <div className="modal-content">
                    <AvForm
                        className="needs-validation"
                        onSubmit={e => {
                            e.preventDefault()
                            updateBudget({
                                id: budget._id,
                                name: budgetName.value,
                                amount: parseFloat(amount.value),
                                showInMenu: showInMenu,
                                startDate: startDate.value,
                                endDate: endDate.value ? endDate.value : null,
                                sortOrder: parseInt(sortOrder.value),
                            })
                            toggle()
                        }}
                    >
                        <ModalHeader toggle={toggle}>
                            {t('Edit Budget')}
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="budgetName">{t('Name')}</Label>
                                <AvInput
                                    name="budgetName"
                                    type="text"
                                    className="form-control"
                                    id="budgetName"
                                    placeholder={t('What is the budget for?')}
                                    errorMessage="Enter Budget Name"
                                    validate={{ required: { value: true } }}
                                    value={budget.name}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="amount">{t('Amount')}</Label>
                                <AvInput
                                    name="amount"
                                    type="text"
                                    className="form-control"
                                    id="amount"
                                    placeholder={t(
                                        'How much should be bugeted?',
                                    )}
                                    errorMessage="Enter Budget Amount"
                                    validate={{ required: { value: true } }}
                                    value={budget.amount}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="startDate">{t('Start Date')}</Label>
                                <Input
                                    type="date"
                                    className="form-control"
                                    id="startDate"
                                    defaultValue={getFormattedDate(
                                        new Date(budget.startDate),
                                    )}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="endDate">{t('End Date')}</Label>
                                <Input
                                    type="date"
                                    className="form-control"
                                    id="endDate"
                                    defaultValue={
                                        budget.endDate
                                            ? getFormattedDate(
                                                  new Date(budget.endDate),
                                              )
                                            : null
                                    }
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="sortOrder">{t('Sort Order')}</Label>
                                <AvInput
                                    name="sortOrder"
                                    type="text"
                                    className="form-control"
                                    id="sortOrder"
                                    errorMessage="Enter Budget Sort Order"
                                    placeholder={t(
                                        'Which position in the list is this budget?',
                                    )}
                                    validate={{ required: { value: true } }}
                                    value={budget.sortOrder}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <div
                                    className="custom-control custom-switch"
                                    dir="ltr"
                                >
                                    <input
                                        type="checkbox"
                                        className="custom-control-input mt-2"
                                        id="showInMenu"
                                        name="showInMenu"
                                        checked={showInMenu}
                                        onChange={() => {
                                            setShowInMenu(!showInMenu)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="showInMenu"
                                    >
                                        {t('Show in Top Menu?')}
                                    </label>
                                </div>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            {showConfirmation ? (
                                <React.Fragment>
                                    <p className="mb-2 mr-5">
                                        {t(
                                            'Do you want to delete this budget?',
                                        )}
                                    </p>
                                    <Button
                                        type="button"
                                        color="danger"
                                        onClick={() => {
                                            deleteBudget({
                                                id: budget._id,
                                            })
                                            setShowConfirmation(false)
                                            toggle()
                                        }}
                                    >
                                        {t('Delete')}
                                    </Button>
                                    <Button
                                        type="button"
                                        color="secondary"
                                        onClick={() => {
                                            setShowConfirmation(false)
                                        }}
                                    >
                                        {t('Cancel')}
                                    </Button>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Button type="submit" color="success">
                                        {t('Save')}
                                    </Button>
                                    <Button
                                        type="button"
                                        color="danger"
                                        onClick={() => {
                                            setShowConfirmation(true)
                                        }}
                                    >
                                        {t('Delete')}
                                    </Button>
                                    <Button
                                        type="button"
                                        color="secondary"
                                        onClick={toggle}
                                    >
                                        {t('Close')}
                                    </Button>
                                </React.Fragment>
                            )}
                        </ModalFooter>
                    </AvForm>
                </div>
            )}
        </Modal>
    )
}

EditBudgetModal.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    budget: PropTypes.object,
    showConfirmation: PropTypes.bool,
    setShowConfirmation: PropTypes.func,
}

export default EditBudgetModal
