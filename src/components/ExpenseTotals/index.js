import { useLocale } from 'hooks'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, Col, Media, Row } from 'reactstrap'

const ExpenseTotals = props => {
    const { budget, expenses } = props
    const { t } = useTranslation()
    const { currency, localeString } = useLocale()

    const totalBudget = budget.amount
    const totalSpent = expenses.reduce((sum, { price }) => sum + price, 0)
    const totalRemaining = totalBudget - totalSpent
    const remainingClass = totalRemaining >= 0 ? 'text-success' : 'text-danger'

    return (
        <Col xl="12">
            <Row>
                <Col sm="3">
                    <Card className="mini-stats-wid">
                        <CardBody>
                            <Media>
                                <div className="mr-3 align-self-center">
                                    <i className="bx bx-purchase-tag h2 text-primary mb-0" />
                                </div>
                                <Media body>
                                    <p className="text-muted mb-2">
                                        {t('Transactions')}
                                    </p>
                                    <h5 className="mb-0">{expenses.length}</h5>
                                </Media>
                            </Media>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="3">
                    <Card className="mini-stats-wid">
                        <CardBody>
                            <Media>
                                <div className="mr-3 align-self-center">
                                    <i className="bx bx-wallet h2 text-warning mb-0" />
                                </div>
                                <Media body>
                                    <p className="text-muted mb-2">
                                        {t('Budget')}
                                    </p>
                                    <h5 className="mb-0">
                                        {totalBudget.toLocaleString(
                                            localeString,
                                            {
                                                style: 'currency',
                                                currency,
                                            },
                                        )}
                                    </h5>
                                </Media>
                            </Media>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="3">
                    <Card className="mini-stats-wid">
                        <CardBody>
                            <Media>
                                <div className="mr-3 align-self-center">
                                    <i className="bx bx-dollar-circle h2 text-info mb-0" />
                                </div>
                                <Media body>
                                    <p className="text-muted mb-2">
                                        {t('Spent')}
                                    </p>
                                    <h5 className="mb-0">
                                        {totalSpent.toLocaleString(
                                            localeString,
                                            {
                                                style: 'currency',
                                                currency,
                                            },
                                        )}
                                    </h5>
                                </Media>
                            </Media>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="3">
                    <Card className="mini-stats-wid">
                        <CardBody>
                            <Media>
                                <div className="mr-3 align-self-center">
                                    <i
                                        className={`bx bx-dollar-circle h2 ${remainingClass} mb-0`}
                                    />
                                </div>
                                <Media body>
                                    <p className="text-muted mb-2">
                                        {t('Remaining')}
                                    </p>
                                    <h5 className="mb-0">
                                        {totalRemaining.toLocaleString(
                                            localeString,
                                            {
                                                style: 'currency',
                                                currency,
                                            },
                                        )}
                                    </h5>
                                </Media>
                            </Media>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Col>
    )
}

ExpenseTotals.propTypes = {
    budget: PropTypes.object,
    expenses: PropTypes.object,
}

export default ExpenseTotals
